<script>
  import { onMount, onDestroy } from "svelte";
  import { getInputKey } from "./input";
  import { Store } from "./store";
  import { tickReducer, directionReducer, renderConsole } from "./snake";

  const TICK_INTERVAL = 150;
  const store = new Store();
  let state;
  let tickInterval;
  let running = false;
  $: grid = state.game.map.grid;
  $: score = state.game.snake.length - 3;
  $: gameOver = state.game.gameOver;

  const unsubscribe = store.select().subscribe(newState => {
    state = newState;
  });

  onDestroy(unsubscribe);

  function handleKeydown(event) {
    if (running) {
      store.reduce(state => directionReducer(state, event));
    }
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

  function handleResetClick() {
    handlePauseClick();
    store.reset();
  }
</script>

<style>
  .game-container {
    display: block;
    width: max-content;
    font-family: sans-serif;
  }

  button {
    font-family: inherit;
  }

  .game-header-container {
    display: flex;
  }

  .game-title {
    margin: 0;
    flex: 1;
  }

  .game-score {
    display: flex;
    align-items: center;
  }

  .game-info-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .snake-grid-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .snake-grid {
    display: grid;
    background: #dedede;
    grid-gap: 1px 1px;
    border: solid 1px #dedede;
    border-radius: 5px;
  }

  .tile {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background: white;
  }

  .tile.snake {
    background: green;
  }
  .tile.food {
    background: red;
  }
  .tile.head {
    background: purple;
  }

  .game-over {
    position: absolute;
    padding: 20px;
    box-shadow: 0 0 10px 2px #dedede;
    border: 1px solid #dedede;
    background: white;
    text-align: center;
    opacity: 0.8;
    border-radius: 5px;
    width: 169px;
    height: 85px;
    cursor: default;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .snake-reset {
    margin-top: 10px;
  }
</style>

<svelte:options tag="svelte-snake" immutable={true} />
<svelte:window on:keydown={handleKeydown} />

<div class="game-container">
  <div class="game-header-container">
    <h1 class="game-title">Snake</h1>
    <span class="game-score">Score: {score}</span>
    <div class="game-info-container">
      {#if !running}
        <button on:click={handleStartClick}>Start Game</button>
      {:else}
        <button on:click={handlePauseClick}>Pause Game</button>
      {/if}
    </div>
  </div>

  <div class="snake-grid-container">
    <div class="snake-grid">
      {#each grid as row, rowIndex}
        {#each row as tile}
          <div
            class="tile"
            class:food={tile.isFood}
            class:snake={tile.isSnake}
            class:head={tile.isSnakeHead}
            style="grid-row: {rowIndex + 1}" />
        {/each}
      {/each}
    </div>

    {#if gameOver}
      <div class="game-over">
        <span>Game Over</span>
        <span>Score: {score}</span>
        <button class="snake-reset" on:click={handleResetClick}>Reset</button>
      </div>
    {/if}
  </div>
</div>
