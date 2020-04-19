"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAP_WIDTH = 20;
exports.MAP_HEIGHT = 20;
const SNAKE_FOOD_TILE = {
    isFood: true,
    isSnake: false,
    isSnakeHead: false,
};
const SNAKE_PART_TILE = {
    isFood: false,
    isSnake: true,
    isSnakeHead: false,
};
const SNAKE_HEAD_TILE = {
    isFood: false,
    isSnake: true,
    isSnakeHead: true,
};
function defaultMap() {
    const grid = emptyGrid();
    return {
        grid,
    };
}
exports.defaultMap = defaultMap;
function updateMap(map, snake, food) {
    const grid = emptyGrid();
    grid[food.i][food.j] = SNAKE_FOOD_TILE;
    snake.parts.forEach((part) => {
        grid[part.i][part.j] = SNAKE_PART_TILE;
    });
    grid[snake.head.i][snake.head.j] = SNAKE_HEAD_TILE;
    return Object.assign(Object.assign({}, map), { grid });
}
exports.updateMap = updateMap;
function isInBorders(map, i, j) {
    let inBorders = i >= 0 && i < exports.MAP_HEIGHT && j >= 0 && j < exports.MAP_WIDTH;
    return inBorders;
}
exports.isInBorders = isInBorders;
function isSnakeTile(map, i, j) {
    const tile = map.grid[i][j];
    return tile.isSnake;
}
exports.isSnakeTile = isSnakeTile;
function isEmptyTile(map, i, j) {
    const tile = map.grid[i][j];
    return !tile.isFood && !tile.isSnake && !tile.isSnakeHead;
}
function emptyGrid() {
    return initGrid((i, j) => {
        return { isFood: false, isSnake: false, isSnakeHead: false };
    });
}
function initGrid(setItem) {
    const grid = [];
    for (let i = 0; i < exports.MAP_HEIGHT; i++) {
        grid[i] = [];
        for (let j = 0; j < exports.MAP_WIDTH; j++) {
            grid[i][j] = setItem(i, j);
        }
    }
    return grid;
}
function randomFood(game, findNew = true) {
    let food = game.food;
    if (findNew) {
        while (true) {
            const i = Math.floor(Math.random() * exports.MAP_HEIGHT);
            const j = Math.floor(Math.random() * exports.MAP_WIDTH);
            if (isEmptyTile(game.map, i, j)) {
                food = { i, j };
                break;
            }
        }
    }
    return food;
}
exports.randomFood = randomFood;
