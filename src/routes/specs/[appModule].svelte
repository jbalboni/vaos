<script context="module">
  export async function load({ page, context }) {
    return {
      props: {
        appModule: page.params.appModule,
        specData: context.specData
      }
    };
  }
</script>

<script>
  import Menu from './_Menu.svelte';
  import Feature from './_Feature.svelte';
  export let specData;
  export let appModule;

  const moduleNames = {
    'appointment-list': 'Appointment list',
    'new-appointment': 'New appointment',
    'covid-19-vaccine': 'COVID-19 vaccine',
    services: 'Service layer'
  };

  $: moduleName = moduleNames[appModule];

  $: features = specData.nodes.filter((feature) =>
    feature.filePath.includes(appModule)
  );
</script>

<div class="container">
  <div class="app-module-column">
    <Menu {specData} />
  </div>
  <div class="feature-column">
    <a href="/specs">Back to index</a>

    <h1>{moduleName}</h1>

    {#each features as feature}
      <Feature {feature} />
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
  }
  .app-module-column {
    width: 33%;
    max-width: 300px;
    margin-right: 20px;
  }
</style>
