<script>
  import { onMount } from 'svelte';

  let pullRequests;
  let loading = true;
  onMount(async () => {
    const response = await fetch('pullRequests.json');
    pullRequests = await response.json();
    loading = false;

    window.addEventListener('focus', async () => {
      loading = true;
      const response = await fetch('pullRequests.json');
      pullRequests = await response.json();
      loading = false;
    });
  });
</script>

<h2>Pull requests</h2>
{#if loading}
  <p>Loading...</p>
{/if}
{#if pullRequests}
  <ul>
    {#each pullRequests as pr}
      <li><a href={pr.url}>{pr.title}</a> ({pr.user})</li>
    {/each}
  </ul>
{/if}

<style>
</style>
