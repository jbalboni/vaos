import { Octokit } from '@octokit/core';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import { GITHUB_TOKEN } from '$lib/Env';

const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit({
  auth: GITHUB_TOKEN
});

export async function get() {
  const frontend = octokit.request(`/repos/{org}/{repo}/pulls`, {
    repo: 'vets-website',
    org: 'department-of-veterans-affairs',
    state: 'open',
    per_page: 100
  });

  const backend = octokit.request(`/repos/{org}/{repo}/pulls`, {
    repo: 'vets-api',
    org: 'department-of-veterans-affairs',
    state: 'open',
    per_page: 100
  });

  const [frontResponse, backResponse] = await Promise.all([frontend, backend]);

  const relevantPRs = frontResponse.data
    .concat(backResponse.data)
    .filter(
      (pr) =>
        !pr.draft &&
        !pr.title.includes('WIP') &&
        pr.requested_teams.some(
          (team) => team.name === 'vfs-vaos-fe' || team.name === 'vfs-vaos'
        )
    );
  return {
    body: relevantPRs.map((pr) => ({
      title: pr.title,
      url: pr.url,
      user: pr.user.login
    }))
  };
}
