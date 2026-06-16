<script lang="ts">
  import Icon from './Icon.svelte'

  export let size = 18
  export let label: string | null = null
</script>

<Icon {size} {label}>
  <path d="m8 7-5 5 5 5"></path>
  <path d="m16 7 5 5-5 5"></path>
  <path d="m14 4-4 16"></path>
</Icon>
