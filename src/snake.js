"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
const input_1 = require("./input");
const map_1 = require("./map");
function defaultGameState() {
    return {
        game: defaultGame(),
        directions: [models_1.Direction.East],
        shouldRender: true,
    };
}
exports.defaultGameState = defaultGameState;
function defaultGame() {
    const food = defaultFood();
    const snake = defaultSnake();
    const map = map_1.updateMap(map_1.defaultMap(), snake, food);
    const gameOver = false;
    return { snake, map, food, gameOver };
}
function defaultSnake() {
    const parts = [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 0, j: 2 }];
    return {
        direction: models_1.Direction.East,
        head: parts[parts.length - 1],
        length: parts.length,
        parts,
        foodEaten: false,
    };
}
function defaultFood() {
    return { i: 0, j: 10 };
}
function validNextDirection(curr, next) {
    let result = false;
    if (next !== models_1.Direction.None) {
        switch (curr) {
            case models_1.Direction.North:
                result = next !== models_1.Direction.South;
                break;
            case models_1.Direction.East:
                result = next !== models_1.Direction.West;
                break;
            case models_1.Direction.South:
                result = next !== models_1.Direction.North;
                break;
            case models_1.Direction.West:
                result = next !== models_1.Direction.East;
                break;
            case models_1.Direction.None:
                result = false;
                break;
        }
    }
    return result;
}
function getNewHead(snake) {
    const head = snake.head;
    let newHead = head;
    switch (snake.direction) {
        case models_1.Direction.North:
            newHead = { i: head.i - 1, j: head.j };
            break;
        case models_1.Direction.East:
            newHead = { i: head.i, j: head.j + 1 };
            break;
        case models_1.Direction.South:
            newHead = { i: head.i + 1, j: head.j };
            break;
        case models_1.Direction.West:
            newHead = { i: head.i, j: head.j - 1 };
            break;
    }
    return newHead;
}
function moveToDirection(snake, direction) {
    if (validNextDirection(snake.direction, direction)) {
        snake = Object.assign(Object.assign({}, snake), { direction });
    }
    const newHead = getNewHead(snake);
    snake.parts = [...snake.parts, newHead];
    return Object.assign(Object.assign({}, snake), { head: newHead, parts: snake.parts, length: snake.parts.length });
}
function snakeFoodEaten(snake, food) {
    const foodEaten = snake.head.i === food.i && snake.head.j === food.j;
    let parts = snake.parts;
    let [tail, ...rest] = snake.parts;
    if (!foodEaten) {
        parts = rest;
    }
    return Object.assign(Object.assign({}, snake), { foodEaten,
        parts, length: parts.length });
}
function isGameOver(game) {
    const { snake, snake: { head } } = game;
    return !map_1.isInBorders(game.map, head.i, head.j) ||
        snake.parts.some(part => part !== head && part.i === head.i && part.j === head.j);
}
function tick(game, direction) {
    game = Object.assign(Object.assign({}, game), { snake: moveToDirection(game.snake, direction) });
    game = Object.assign(Object.assign({}, game), { snake: snakeFoodEaten(game.snake, game.food) });
    game = Object.assign(Object.assign({}, game), { food: map_1.randomFood(game, game.snake.foodEaten) });
    game = Object.assign(Object.assign({}, game), { gameOver: isGameOver(game) });
    if (!game.gameOver) {
        game = Object.assign(Object.assign({}, game), { map: map_1.updateMap(game.map, game.snake, game.food) });
    }
    return game;
}
function tickReducer(state) {
    const [curDirection, nextDirection, ...rest] = state.directions;
    let direction = curDirection;
    if (nextDirection !== undefined) {
        direction = nextDirection;
    }
    const directions = state.directions.length === 1
        ? state.directions
        : [nextDirection, ...rest];
    const game = tick(state.game, direction);
    return Object.assign(Object.assign({}, state), { game,
        directions, shouldRender: true });
}
exports.tickReducer = tickReducer;
function inputToDirection(inputKey) {
    let res = models_1.Direction.None;
    switch (inputKey) {
        case input_1.InputKey.Left:
            res = models_1.Direction.West;
            break;
        case input_1.InputKey.Right:
            res = models_1.Direction.East;
            break;
        case input_1.InputKey.Down:
            res = models_1.Direction.South;
            break;
        case input_1.InputKey.Up:
            res = models_1.Direction.North;
            break;
    }
    return res;
}
function getDirection(event) {
    const inputKey = input_1.getInputKey(event.keyCode);
    const newDirection = inputToDirection(inputKey);
    return newDirection;
}
function directionReducer(state, event) {
    let result = state;
    const newDirection = getDirection(event);
    if (newDirection !== models_1.Direction.None) {
        result = Object.assign(Object.assign({}, state), { directions: [...state.directions, newDirection], shouldRender: false });
    }
    return result;
}
exports.directionReducer = directionReducer;
function renderConsole(state) {
    if (state.shouldRender) {
        const map = state.game.map;
        const strGrid = map.grid
            .map((row) => row
            .map((item) => item.isSnakeHead ? '@' : item.isSnake ? 'x' : item.isFood ? '*' : '.')
            .join(' '))
            .join('\n');
        console.log(strGrid + '\n');
    }
}
exports.renderConsole = renderConsole;
