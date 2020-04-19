import { Food, Snake, Map, Game, Tile } from './models';

export const MAP_WIDTH = 20;
export const MAP_HEIGHT = 20;

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

export function defaultMap(): Map {
  const grid = emptyGrid();

  return {
    grid,
  };
}

export function updateMap(map: Map, snake: Snake, food: Food): Map {
  const grid = emptyGrid();
  grid[food.i][food.j] = SNAKE_FOOD_TILE;
  snake.parts.forEach((part) => {
    grid[part.i][part.j] = SNAKE_PART_TILE;
  });

  grid[snake.head.i][snake.head.j] = SNAKE_HEAD_TILE;

  return {
    ...map,
    grid,
  };
}

export function isInBorders(map: Map, i: number, j: number): boolean {
  let inBorders = i >= 0 && i < MAP_HEIGHT && j >= 0 && j < MAP_WIDTH;
  return inBorders;
}

export function isSnakeTile(map: Map, i: number, j: number): boolean {
  const tile = map.grid[i][j];
  return tile.isSnake;
}

function isEmptyTile(map: Map, i: number, j: number): boolean {
  const tile = map.grid[i][j];
  return !tile.isFood && !tile.isSnake && !tile.isSnakeHead;
}

function emptyGrid(): Tile[][] {
  return initGrid((i, j) => {
    return { isFood: false, isSnake: false, isSnakeHead: false };
  });
}

function initGrid(setItem: (i: number, j: number) => Tile): Tile[][] {
  const grid: Tile[][] = [];
  for (let i = 0; i < MAP_HEIGHT; i++) {
    grid[i] = [];
    for (let j = 0; j < MAP_WIDTH; j++) {
      grid[i][j] = setItem(i, j);
    }
  }
  return grid;
}

export function randomFood(game: Game, findNew = true): Food {
  let food = game.food;
  if (findNew) {
    while (true) {
      const i = Math.floor(Math.random() * MAP_HEIGHT);
      const j = Math.floor(Math.random() * MAP_WIDTH);
      if (isEmptyTile(game.map, i, j)) {
        food = { i, j };
        break;
      }
    }
  }
  return food;
}
