import { GameState } from './models';
import { defaultGameState } from './snake';
import { writable, Writable, Readable } from 'svelte/store'

const DEFAULT_GAME_STATE = defaultGameState();

export class Store {
  private state: Writable<GameState> = writable(DEFAULT_GAME_STATE);

  public select(): Readable<GameState> {
    return this.state;
  }

  public reduce(reducer: (state: GameState) => GameState) {
    this.state.update(reducer);
  }

  public reset() {
    this.state.set(DEFAULT_GAME_STATE);
  }
}
