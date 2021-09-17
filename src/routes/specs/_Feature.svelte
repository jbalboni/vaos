<script>
  import Scenario from './_Scenario.svelte';
  export let feature;
</script>

<section class="feature">
  <h3>Feature: {feature.name.replace('VAOS ', '')}</h3>
  {#each feature.nodes as node}
    {#if node.type === 'Background' && node.isGWT}
      <section class="feature">
        <h4>Background: {node.name}</h4>
        {#each node.nodes as scenario}
          {#if scenario.isGWT}
            <Scenario {scenario} level="5" />
          {/if}
        {/each}
      </section>
    {/if}
    {#if node.type === 'Scenario'}
      {#if node.isGWT}
        <Scenario scenario={node} level="4" />
      {/if}
    {/if}
  {/each}
</section>

<style>
  .feature {
    margin-left: 15px;
  }
</style>
