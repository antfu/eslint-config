<script lang='ts'>
  export const content = "hi!"
</script>
  
<article>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <div>{@html content}</div>
</article>