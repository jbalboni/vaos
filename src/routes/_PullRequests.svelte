<script>
  import { onMount } from 'svelte';
  import { pullRequests } from '$lib/stores';

  let loading = true;
  let lastFetch = Date.now();
  onMount(async () => {
    const response = await fetch('pullRequests.json');
    pullRequests.set(await response.json());
    loading = false;

    window.addEventListener('focus', async () => {
      if (Date.now() - lastFetch > 15000) {
        loading = true;
        const response = await fetch('pullRequests.json');
        pullRequests.set(await response.json());
        lastFetch = Date.now();
        loading = false;
      }
    });
  });
</script>

<h2>Pull requests</h2>
{#if loading}
  <span>refreshing...</span>
{/if}
{#if $pullRequests}
  <ul>
    {#each $pullRequests as pr}
      <li>
        <a target="_blank" rel="nofollow noreferrer" href={pr.url}>{pr.title}</a
        >
        ({pr.user})
      </li>
    {/each}
  </ul>
{/if}

<style>
  h2 {
    display: inline-block;
    margin-top: 0;
  }
  ul {
    margin: 0;
  }
</style>
