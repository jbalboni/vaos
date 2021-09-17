<script context="module">
  export async function load({ page, fetch }) {
    try {
      const response = await fetch(`/specs.json`);
      const specData = await response.json();

      return {
        context: {
          specData
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

<slot />

<style>
  :global(body) {
    margin: 15px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
