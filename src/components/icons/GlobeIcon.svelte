<script lang="ts">
  import Icon from './Icon.svelte'

  export let size = 18
  export let label: string | null = null
</script>

<Icon {size} {label}>
  <circle cx="12" cy="12" r="9"></circle>
  <path d="M3.2 9h17.6"></path>
  <path d="M3.2 15h17.6"></path>
  <path d="M12 3a13 13 0 0 1 0 18"></path>
  <path d="M12 3a13 13 0 0 0 0 18"></path>
</Icon>
