<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  
  const { character } = data;
  let characterTotGames = character.wins + character.losses + character.ties
</script>
<main class="character-details">
  <h1>{character.name}</h1>
  <p>{characterTotGames}</p>
  <p>{character.wins}</p>
</main>

<a href="/characters"> Tillbaka till alla characters</a>