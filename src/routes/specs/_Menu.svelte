<script>
  import { specs } from './specStore';
  export let specData;

  const featureByModule = {
    'appointment-list': [],
    'new-appointment': [],
    'covid-19-vaccine': [],
    services: []
  };

  const moduleNames = {
    'appointment-list': 'Appointment list',
    'new-appointment': 'New appointment',
    'covid-19-vaccine': 'COVID-19 vaccine',
    services: 'Service layer'
  };

  const availableSpecs = $specs || specData;
  if (availableSpecs) {
    availableSpecs.nodes.forEach((feature) => {
      const [moduleName, ...path] = feature.filePath
        .replace('./src/applications/vaos/tests/', '')
        .split('/');

      if (featureByModule[moduleName]) {
        featureByModule[moduleName].push(feature);
      }
    });
  }
</script>

<div class="app-module-column">
  {#each Object.keys(featureByModule) as moduleName}
    {#if featureByModule[moduleName].length}
      <a class="app-module-link" href={`/specs/${moduleName}`}
        >{moduleNames[moduleName]}</a
      >
    {/if}
  {/each}
</div>

<style>
  .app-module-link {
    display: block;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #eee;
    text-decoration: none;
    color: black;
  }
  .app-module-link:hover {
    background-color: #ddd;
  }
</style>
