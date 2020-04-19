"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const snake_1 = require("./snake");
const store_1 = require("svelte/store");
const DEFAULT_GAME_STATE = snake_1.defaultGameState();
class Store {
    constructor() {
        this.state = store_1.writable(DEFAULT_GAME_STATE);
    }
    select() {
        return this.state;
    }
    reduce(reducer) {
        this.state.update(reducer);
    }
    reset() {
        this.state.set(DEFAULT_GAME_STATE);
    }
}
exports.Store = Store;
