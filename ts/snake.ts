import { Direction, Food, Snake, SnakePart, Game, GameState } from './models';
import { InputKey, getInputKey } from './input';
import { defaultMap, randomFood, updateMap, isInBorders } from './map';

export function defaultGameState(): GameState {
  return {
    game: defaultGame(),
    directions: [Direction.East],
    shouldRender: true,
  };
}

function defaultGame(): Game {
  const food = defaultFood();
  const snake = defaultSnake();
  const map = updateMap(defaultMap(), snake, food);
  const gameOver = false;
  return { snake, map, food, gameOver };
}

function defaultSnake(): Snake {
  const parts = [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 0, j: 2 }];
  return {
    direction: Direction.East,
    head: parts[parts.length - 1],
    length: parts.length,
    parts,
    foodEaten: false,
  };
}

function defaultFood(): Food {
  return { i: 0, j: 10 };
}

function validNextDirection(curr: Direction, next: Direction): boolean {
  let result = false;
  if (next !== Direction.None) {
    switch (curr) {
      case Direction.North:
        result = next !== Direction.South;
        break;
      case Direction.East:
        result = next !== Direction.West;
        break;
      case Direction.South:
        result = next !== Direction.North;
        break;
      case Direction.West:
        result = next !== Direction.East;
        break;
      case Direction.None:
        result = false;
        break;
    }
  }
  return result;
}

function getNewHead(snake: Snake): SnakePart {
  const head = snake.head;
  let newHead = head;
  switch (snake.direction) {
    case Direction.North:
      newHead = { i: head.i - 1, j: head.j };
      break;
    case Direction.East:
      newHead = { i: head.i, j: head.j + 1 };
      break;
    case Direction.South:
      newHead = { i: head.i + 1, j: head.j };
      break;
    case Direction.West:
      newHead = { i: head.i, j: head.j - 1 };
      break;
  }
  return newHead;
}

function moveToDirection(snake: Snake, direction: Direction): Snake {
  if (validNextDirection(snake.direction, direction)) {
    snake = {
      ...snake,
      direction,
    };
  }

  const newHead = getNewHead(snake);
  snake.parts = [...snake.parts, newHead];

  return {
    ...snake,
    head: newHead,
    parts: snake.parts,
    length: snake.parts.length,
  };
}

function snakeFoodEaten(snake: Snake, food: Food): Snake {
  const foodEaten = snake.head.i === food.i && snake.head.j === food.j;
  let parts = snake.parts;

  let [tail, ...rest] = snake.parts;
  if (!foodEaten) {
    parts = rest;
  }

  return {
    ...snake,
    foodEaten,
    parts,
    length: parts.length,
  };
}

function isGameOver(game: Game): boolean {
  const { snake, snake: { head } } = game;
  return !isInBorders(game.map, head.i, head.j) ||
    snake.parts.some(part => part !== head && part.i === head.i && part.j === head.j);
}

function tick(game: Game, direction: Direction): Game {
  game = { ...game, snake: moveToDirection(game.snake, direction) };
  game = { ...game, snake: snakeFoodEaten(game.snake, game.food) };
  game = { ...game, food: randomFood(game, game.snake.foodEaten) };
  game = { ...game, gameOver: isGameOver(game) };
  if (!game.gameOver) {
    game = { ...game, map: updateMap(game.map, game.snake, game.food) };
  }
  return game;
}

export function tickReducer(state: GameState): GameState {
  const [curDirection, nextDirection, ...rest] = state.directions;
  let direction = curDirection;
  if (nextDirection !== undefined) {
    direction = nextDirection;
  }
  const directions = state.directions.length === 1
    ? state.directions
    : [nextDirection, ...rest];
  const game = tick(state.game, direction);
  return {
    ...state,
    game,
    directions,
    shouldRender: true,
  };
}

function inputToDirection(inputKey: InputKey): Direction {
  let res: Direction = Direction.None;
  switch (inputKey) {
    case InputKey.Left:
      res = Direction.West;
      break;
    case InputKey.Right:
      res = Direction.East;
      break;
    case InputKey.Down:
      res = Direction.South;
      break;
    case InputKey.Up:
      res = Direction.North;
      break;
  }
  return res;
}

function getDirection(event: KeyboardEvent): Direction {
  const inputKey = getInputKey(event.keyCode);
  const newDirection = inputToDirection(inputKey);
  return newDirection;
}

export function directionReducer(state: GameState, event: KeyboardEvent): GameState {
  let result = state;
  const newDirection = getDirection(event);
  if (newDirection !== Direction.None) {
    result = {
      ...state,
      directions: [...state.directions, newDirection],
      shouldRender: false,
    };
  }
  return result;
}

export function renderConsole(state: GameState) {
  if (state.shouldRender) {
    const map = state.game.map;
    const strGrid = map.grid
      .map((row) =>
        row
          .map((item) =>
            item.isSnakeHead ? '@' : item.isSnake ? 'x' : item.isFood ? '*' : '.',
          )
          .join(' '),
      )
      .join('\n');
    console.log(strGrid + '\n');
  }
}
