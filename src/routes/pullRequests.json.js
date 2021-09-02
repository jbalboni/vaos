import { Octokit } from '@octokit/core';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import { GITHUB_TOKEN } from '$lib/Env';

const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit({
  auth: GITHUB_TOKEN
});

export async function get() {
  const response = await octokit.request(`/repos/{org}/{repo}/pulls`, {
    repo: 'vets-website',
    org: 'department-of-veterans-affairs',
    state: 'open',
    per_page: 100
  });

  const relevantPRs = response.data.filter(
    (pr) =>
      !pr.draft &&
      pr.requested_teams.some((team) => team.name === 'vfs-vaos-fe')
  );
  return {
    body: relevantPRs.map((pr) => ({
      title: pr.title,
      url: pr.url,
      user: pr.user.login
    }))
  };
}
