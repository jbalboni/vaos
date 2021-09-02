<script context="module">
  export async function load({ page, fetch }) {
    try {
      const response = await fetch(`changeMetrics.json?path=vaos&label=vaos`);
      const metrics = await response.json();

      return {
        props: {
          metrics
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
  import DeployedChanges from './_DeployedChanges.svelte';
  import LeadTime from './_LeadTime.svelte';
  import FailureRate from './_FailureRate.svelte';
  import PullRequests from './_PullRequests.svelte';

  export let metrics;
</script>

<div class="row">
  <div class="metric-chart">
    <DeployedChanges data={metrics.changes} />
  </div>
  <div class="metric-chart">
    <LeadTime data={metrics.leadTime} />
  </div>
  <div class="metric-chart">
    <FailureRate data={metrics} />
  </div>
  <div class="metric-chart">
    <PullRequests />
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
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
  }
  .metric-chart {
    flex: 1;
    min-width: 30%;
    margin: 5px;
  }
</style>
