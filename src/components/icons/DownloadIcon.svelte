<script lang="ts">
  import Icon from './Icon.svelte'

  export let size = 18
  export let label: string | null = null
</script>

<Icon {size} {label}>
  <path d="M12 4v10"></path>
  <path d="m8.5 10.5 3.5 3.5 3.5-3.5"></path>
  <path d="M5 18h14"></path>
</Icon>
