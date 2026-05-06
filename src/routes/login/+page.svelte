<script>
  import { enhance } from '$app/forms';
  export let form;
  
  let loading = false;
</script>

<h1>Login</h1>

<!-- Login-formulär -->
<!-- Din uppgift: Skapa formuläret -->
<form method="POST" action="?/login" use:enhance={() => {
    // Din uppgift: Vad ska hända när form submits?
    loading = true;
    return async ({ result, update }) => {
      loading = false;
      await update();
    };
  }}
  >
    
  

  <div>
    <label for="username">Användarnamn:</label>
    <!-- Din input här - vilka attribut behöver den? -->
    <input 
      id="username"
      type="text" 
      name="username"
      required
      placeholder="skriv användarnamn"
    />
  </div>
  
  <!-- Din uppgift: Lägg till password-fält på samma sätt -->
   <div>
    <label for="password">Lösenord:</label>
    <!-- Din input här - vilka attribut behöver den? -->
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

<!-- Register-formulär -->
<!-- Din uppgift: Skapa register-formuläret -->
<!-- Tips: använd action="?/register" -->
<form method="POST" action="?/register">
  <div>
    <label for="username">Användarnamn:</label>
    <!-- Din input här - vilka attribut behöver den? -->
    <input 
      id="username"
      type="text" 
      name="username"
      required
      placeholder="skriv användarnamn"
    />
  </div>
  <!-- <div>
    <label for="email">Email:</label> 
    <input 
      id="email"
      type="email" 
      name="username"
      required
      placeholder="skriv användarnamn"
    />
  </div> -->
  
  <!-- Din uppgift: Lägg till password-fält på samma sätt -->
   <div>
    <label for="password">Lösenord:</label>
    <!-- Din input här - vilka attribut behöver den? -->
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

<!-- Visa fel-meddelanden om de finns -->
{#if form?.error}
  <div class="error">
    {form.error}
  </div>
{/if}

<style>
  /* Din uppgift: Lägg till styling */
  /* Tips: formulär behöver struktur och spacing */
   
</style>