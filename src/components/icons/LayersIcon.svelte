<script lang="ts">
  import Icon from './Icon.svelte'

  export let size = 18
  export let label: string | null = null
</script>

<Icon {size} {label}>
  <path d="m12 3 9 5-9 5-9-5 9-5Z"></path>
  <path d="m3 12 9 5 9-5"></path>
  <path d="m3 16 9 5 9-5"></path>
</Icon>
