<script context="module">
  export async function load({ context }) {
    try {
      return {
        props: {
          specData: context.specData
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
  import Menu from './_Menu.svelte';
  export let specData;
</script>

<div class="container">
  <div class="app-module-column">
    <Menu {specData} />
  </div>
  <div class="feature-column">
    <h1>VAOS front end specifications</h1>

    Choose application area
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
