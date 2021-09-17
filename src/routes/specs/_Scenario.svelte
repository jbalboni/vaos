<script>
  export let scenario;
  export let level;
  let open = false;

  function tagForPart(part) {
    const [tag, ...rest] = part.split(' ');

    return tag;
  }

  function partWithoutTag(part) {
    const [tag, ...rest] = part.split(' ');

    return rest.join(' ');
  }

  function isSectionStart(part) {
    return (
      part.startsWith('Given') ||
      part.startsWith('When') ||
      part.startsWith('Then')
    );
  }
  function toggleOpen() {
    open = !open;
  }
</script>

<section class="scenario" class:open>
  <div class="header">
    <div class="show-button">
      <button on:click={toggleOpen}>{open ? 'Hide' : 'Show'}</button>
    </div>
    {#if level === '4'}
      <h4>{scenario.name}</h4>
    {/if}
    {#if level === '5'}
      <h5>{scenario.name}</h5>
    {/if}
  </div>
  {#if open}
    <div class="parts">
      {#each scenario.parts as part}
        <div
          class:and-part={!isSectionStart(part)}
          class:section-part={isSectionStart(part)}
        >
          <strong>{tagForPart(part)}</strong>
          {partWithoutTag(part)}
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  .scenario,
  .and-part {
    margin-left: 15px;
  }
  .parts {
    margin-left: 55px;
  }
  .scenario.open {
    margin-bottom: 30px;
  }
  .section-part {
    margin-top: 5px;
  }
  .show-button {
    width: 50px;
    flex-shrink: 0;
  }
  .header {
    display: flex;
    margin-bottom: 10px;
  }
  .header > h5,
  .header > h4 {
    margin: 0;
    font-size: 16px;
    margin-left: 5px;
  }
</style>
