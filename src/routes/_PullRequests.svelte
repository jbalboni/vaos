<script>
  import { onMount } from 'svelte';

  let pullRequests;
  onMount(async () => {
    const response = await fetch('pullRequests.json');
    pullRequests = await response.json();

    window.addEventListener('focus', async () => {
      pullRequests = null;
      const response = await fetch('pullRequests.json');
      pullRequests = await response.json();
    });
  });
</script>

<h2>Pull requests</h2>
{#if !pullRequests}
  <p>Loading...</p>
{:else}
  <ul>
    {#each pullRequests as pr}
      <li><a href={pr.url}>{pr.title}</a> ({pr.user})</li>
    {/each}
  </ul>
{/if}

<style>
</style>
