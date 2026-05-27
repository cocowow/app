<script>
  import { enhance } from '$app/forms';
  export let form;
  
  let loading = false;
</script>

<h1>Login</h1>

<form method="POST" action="?/login" use:enhance={() => {
    
    loading = true;
    return async ({ result, update }) => {
      loading = false;
      await update();
    };
  }}
  >
    
  

  <div>
    <label for="username">Användarnamn:</label>
    
    <input 
      id="username"
      type="text" 
      name="username"
      required
      placeholder="skriv användarnamn"
    />
  </div>
  
 
   <div>
    <label for="password">Lösenord:</label>
    
    <input 
      id="password"
      type="password" 
      name="password"
      required
      placeholder="skriv ditt lösenord"
    />
  </div>
  
  
  <button type="submit" disabled={loading}>
    {loading ? 'Loggar in...' : 'Logga in'}
  </button>
</form>

<h2>Ny användare?</h2>


<form method="POST" action="?/register">
  <div>
    <label for="username">Användarnamn:</label>
    
    <input 
      id="username"
      type="text" 
      name="username"
      required
      placeholder="skriv användarnamn"
    />
  </div>

   <div>
    <label for="password">Lösenord:</label>

    <input 
      id="password"
      type="password" 
      name="password"
      required
      placeholder="skriv ditt lösenord"
    />
  </div>
  
  
  <button type="submit" disabled={loading}>
    {loading ? 'Registrerar...' : 'Registrera dig'}
  </button>
</form>

{#if form?.error}
  <div class="error">
    {form.error}
  </div>
{/if}

<style>

</style>