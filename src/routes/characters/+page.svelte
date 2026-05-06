<script>
    export let data;

    let characters = data.characters;
</script>

<main>
<h1>Characters</h1>

<!-- Bara namn först -->
 <div class="char">
{#each characters as character}
  <div class="link"><a href="/characters/{character.id}">
        {character.name} - Wins: {character.wins}
      </a></div>
{/each}
</div>
<p>Create a character</p>
<form method="POST" action="?/create">
  <input name="name" placeholder="Character name" />
  <button>Create</button>  
</form>

</main>

<style>
  main{
    
    background-color: rgba(239, 168, 192, 0.253);
    width: 70vw;
    border-radius: 1%;
    height: 70vh;
    justify-self: center;
    padding: 100px;
  }
  .char{
    width: 99%;
    padding: 10px;
    padding-top: 1px;
    justify-self: center;
  }
  .link{
    margin-top: 20px;
  }
</style>