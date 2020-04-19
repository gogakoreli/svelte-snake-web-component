import Snake from './snake.svelte';

const snake = new Snake({
  target: document.body,
  props: {
    // name: 'world'
  }
});

export default snake;
