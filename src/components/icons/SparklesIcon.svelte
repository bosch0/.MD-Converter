<script lang="ts">
  import Icon from './Icon.svelte'

  export let size = 18
  export let label: string | null = null
</script>

<Icon {size} {label}>
  <path d="m12 3 1.9 4.6 4.6 1.9-4.6 1.9L12 16l-1.9-4.6-4.6-1.9 4.6-1.9L12 3Z"></path>
  <path d="M19 4v3"></path>
  <path d="M20.5 5.5h-3"></path>
  <path d="M5 17v4"></path>
  <path d="M7 19H3"></path>
</Icon>
