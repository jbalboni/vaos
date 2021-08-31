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
</div>

<style>
  .row {
    display: flex;
    width: 100%;
  }
  .metric-chart {
    flex: 1;
  }
</style>
