<script>
  export let data; // Kommer från +layout.server.ts
</script>

<nav class="main-nav">
  <div class="nav-left">
    <a href="/">Hem</a>
    <!-- Din uppgift: Visa olika navigation beroende på om användaren är inloggad -->
    {#if data.user}
      <a href="/characters">Your characters</a>
    {/if}
  </div>
  
  <div class="nav-right">
    <!-- Din uppgift: Implementera conditional navigation -->
    {#if data.user}
      <span>Välkommen, {data.user.username}!</span>
      <!-- Logout-knapp som anropar logout action -->
      <form method="POST" action="/login?/logout" style="display: inline;">
        <button type="submit">Logga ut</button>
      </form>
    {:else}
      <!-- Länk till login för ej inloggade -->
      <a href="/login">Logga in</a>
    {/if}
  </div>
</nav>

<main>
  <slot />
</main>

<style>
  /* Din styling här */
</style>