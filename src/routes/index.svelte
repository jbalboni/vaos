<script context="module">
  import { get } from 'svelte/store';
  import { pullRequests } from '$lib/stores';

  export async function load({ page, fetch }) {
    try {
      let pullRequestData = get(pullRequests);
      if (!pullRequestData) {
        const response = await fetch(`/pullRequests.json`);
        pullRequestData = await response.json();
      }

      return {
        props: {
          pullRequestData
        }
      };
    } catch (e) {
      return {
        status: 500,
        body: e.message
      };
    }
  }
</script>

<script>
  import { metrics } from '$lib/stores';
  import DeployedChanges from './_DeployedChanges.svelte';
  import LeadTime from './_LeadTime.svelte';
  import FailureRate from './_FailureRate.svelte';
  import PullRequests from './_PullRequests.svelte';
  import { onMount } from 'svelte';

  export let pullRequestData;

  onMount(async () => {
    const response = await fetch(`changeMetrics.json?path=vaos&label=vaos`);
    metrics.set(await response.json());
    pullRequests.set(pullRequestData);
  });
</script>

<div class="row">
  <div class="metric-chart">
    <PullRequests {pullRequestData} />
  </div>
  <div class="metric-chart">
    <h2>Specs</h2>
    <a href="specs">View specs</a>
  </div>
</div>
<h2>Metrics</h2>
<div class="row">
  {#if $metrics}
    <div class="metric-chart">
      <DeployedChanges data={$metrics.changes} />
    </div>
    <div class="metric-chart">
      <LeadTime data={$metrics.leadTime} />
    </div>
    <div class="metric-chart">
      <FailureRate data={$metrics} />
    </div>
  {:else}
    Loading metrics...
  {/if}
</div>

<style>
  :global(body) {
    margin: 10px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .row {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .metric-chart {
    flex: 1;
    min-width: 30%;
    margin: 5px;
  }
  h2 {
    margin-top: 0;
  }
</style>
