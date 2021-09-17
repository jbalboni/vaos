import { Octokit } from '@octokit/core';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import { GITHUB_TOKEN } from '$lib/Env';
import specsData from './specsData.json';

const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit({
  auth: GITHUB_TOKEN
});

export async function get() {
  // const commit = await octokit.request(`/repos/{org}/{repo}/commits/{sha}`, {
  //   repo: 'vets-website',
  //   org: 'department-of-veterans-affairs',
  //   sha: 'master'
  // });

  // const data = await octokit.request(`/repos/{org}/{repo}/git/trees/{sha}`, {
  //   repo: 'vets-website',
  //   org: 'department-of-veterans-affairs',
  //   sha: commit.data.commit.tree.sha,
  //   recursive: 1
  // });

  // const files = data.data.tree.filter(
  //   (f) =>
  //     f.path.includes('vaos/tests') &&
  //     f.path.includes('unit.spec') &&
  //     f.type === 'blob'
  // );

  // const testFiles = await octokit.request(
  //   `/repos/{org}/{repo}/contents/{path}`,
  //   {
  //     repo: 'vets-website',
  //     org: 'department-of-veterans-affairs',
  //     path: 'src/applications/vaos/tests',
  //     recursive: true
  //   }
  // );

  return {
    body: specsData
  };
}
