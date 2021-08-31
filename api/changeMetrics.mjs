import moment from 'moment';
import { Octokit } from '@octokit/core';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import Redis from 'ioredis';

const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit({
  auth: process.env.GITHUB_TOKEN
});

const intervalConfig = {
  day: {
    format: 'MMM D'
  },
  week: {
    format: 'MMM D'
  },
  month: {
    format: 'MMM YYYY'
  }
};

const excludedCommits = ['6ad7a9e5f09d3cc113cfd1ca6927c8fce9a1d1eb'];

function generateInterval(start, interval, defaultValue = 0) {
  const intervals = {};
  let current = moment(start).startOf(interval);
  const now = moment();
  while (current.isBefore(now.startOf(interval))) {
    intervals[current.format(intervalConfig[interval].format)] =
      typeof defaultValue === 'object'
        ? {
            ...defaultValue
          }
        : defaultValue;
    current.add(1, interval);
  }

  return intervals;
}

export default async function changeMetrics(req, res) {
  const {
    start = moment().subtract(3, 'months').startOf('day').format(),
    path,
    label,
    bugLabels = ['bug', 'frontend', 'production'],
    interval = 'week'
  } = req.query;
  const client = new Redis(process.env.REDIS_URL);

  const leadTime = [];
  const changes = [];
  const commitList = (
    await octokit.paginate(`/repos/{org}/{repo}/commits`, {
      repo: 'vets-website',
      org: 'department-of-veterans-affairs',
      since: moment(start).format(),
      path: `src/applications/${path}`,
      per_page: 100
    })
  ).filter((d) => !excludedCommits.includes(d.sha));

  for (const data of commitList) {
    let pullRequest;
    let cachedPull = await client.get(`pull_${data.sha}`);
    if (!cachedPull) {
      const pulls = await octokit.request(
        `/repos/{org}/{repo}/commits/{id}/pulls`,
        {
          repo: 'vets-website',
          org: 'department-of-veterans-affairs',
          id: data.sha,
          mediaType: {
            previews: ['groot']
          }
        }
      );
      pullRequest = pulls.data[0];
      await client.set(`pull_${data.sha}`, JSON.stringify(pullRequest));
    } else {
      pullRequest = JSON.parse(cachedPull);
    }

    leadTime.push({
      time: moment(pullRequest.merged_at).diff(pullRequest.created_at, 'hours'),
      date: pullRequest.merged_at
    });
    changes.push(data.commit.committer.date);
  }

  const bugs = (
    await octokit.paginate(`/repos/{org}/{repo}/issues`, {
      repo: 'va.gov-team',
      org: 'department-of-veterans-affairs',
      since: moment(start).format(),
      filter: 'all',
      labels: [label, ...bugLabels].join(','),
      state: 'all',
      per_page: 100
    })
  )
    .filter((b) => moment(b.created_at).isAfter(start))
    .map((b) => b.created_at);

  const bugMap = bugs
    .map((c) =>
      moment(c).startOf(interval).format(intervalConfig[interval].format)
    )
    .reduce((cur, next) => {
      cur[next]++;
      return cur;
    }, generateInterval(start, interval));
  const changeMap = changes
    .map((c) =>
      moment(c).startOf(interval).format(intervalConfig[interval].format)
    )
    .reduce((cur, next) => {
      cur[next]++;
      return cur;
    }, generateInterval(start, interval));
  const leadTimeMap = leadTime
    .map((c) => ({
      time: c.time,
      date: moment(c.date)
        .startOf(interval)
        .format(intervalConfig[interval].format)
    }))
    .reduce((cur, next) => {
      if (cur[next.date]) {
        cur[next.date].sum += next.time;
        cur[next.date].count++;
      }
      return cur;
    }, generateInterval(start, interval, { sum: 0, count: 0 }));

  res.json({
    changes: Object.entries(changeMap).map(([key, val]) => ({
      x: key,
      y: val
    })),
    leadTime: Object.entries(leadTimeMap).map(([key, val]) => ({
      x: key,
      y: !val.count ? 0 : (val.sum / val.count / 24.0).toFixed(2)
    })),
    bugs: Object.entries(bugMap).map(([key, val]) => ({
      x: key,
      y: val
    }))
  });
}

// console.log(
//   JSON.stringify(
//     await changeMetrics({
//       start: '2021-06-01',
//       path: 'personalization',
//       labels: ['vaos', 'frontend', 'production'],
//       interval: 'week',
//     }),
//     null,
//     2,
//   ),
// );
