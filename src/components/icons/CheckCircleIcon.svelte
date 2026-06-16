<script lang="ts">
  import Icon from './Icon.svelte'

  export let size = 18
  export let label: string | null = null
</script>

<Icon {size} {label}>
  <circle cx="12" cy="12" r="9"></circle>
  <path d="m8.5 12 2.3 2.3L15.7 9.4"></path>
</Icon>
