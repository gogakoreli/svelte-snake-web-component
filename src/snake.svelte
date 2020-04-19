<script>
  import { onMount } from "svelte";
  import { getInputKey } from "./input";
  import { Store } from "./store";
  import { tickReducer, directionReducer, renderConsole } from "./snake";

  const TICK_INTERVAL = 150;
  const store = new Store();
  let state = null;
  let tickInterval;
  let running = false;

  onMount(() => {
    console.log("onMount");
  });

  store.select().subscribe(newState => {
    state = newState;
    renderConsole(state);
  });

  function handleKeydown(event) {
    store.reduce(state => directionReducer(state, event));
  }

  function handleStartClick() {
    running = true;
    tickInterval = setInterval(() => {
      store.reduce(tickReducer);
    }, TICK_INTERVAL);
  }

  function handlePauseClick() {
    running = false;
    clearInterval(tickInterval);
  }
</script>

<style>

</style>

<svelte:options tag="svelte-snake" immutable={true} />
<svelte:window on:keydown={handleKeydown} />

<div class="game-header-container">
  <h1 class="game-title">Snake</h1>
  <span class="game-score">Score: {state.game.snake.length - 3}</span>
  <div class="game-info-container">
    {#if !running}
      <button on:click={handleStartClick}>Start Game</button>
    {:else}
      <button on:click={handlePauseClick}>Pause Game</button>
    {/if}
  </div>
</div>
