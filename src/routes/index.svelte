<script>
  import DeployedChanges from './_DeployedChanges.svelte';
  import LeadTime from './_LeadTime.svelte';
  import FailureRate from './_FailureRate.svelte';

  async function getMetrics() {
    const response = await fetch(
      `${process.env.VERCEL_URL}/api/changeMetrics?path=vaos&label=vaos`
    );
    return response.json();
  }

  const promise = getMetrics();
</script>

{#await promise}
  <p>Loading</p>
{:then metrics}
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
{:catch}
  <p>Data failed to load</p>
{/await}

<style>
  .row {
    display: flex;
    width: 100%;
  }
  .metric-chart {
    flex: 1;
  }
</style>
