<script>
  import { onMount } from "svelte";
  import { getInputKey } from "./input";

  export let name = "test";
  let time = new Date();

  // these automatically update when `time`
  // changes, because of the `$:` prefix
  $: hours = time.getHours();
  $: minutes = time.getMinutes();
  $: seconds = time.getSeconds();

  onMount(() => {
    console.log("bla");
  });

  function handleKeydown(event) {
    console.log(event);
  }
</script>

<style>

</style>

<svelte:options tag="svelte-clock" immutable={true} />
<svelte:window on:keydown={handleKeydown} />
{name}
