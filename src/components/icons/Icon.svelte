<script lang="ts">
  export let size = 18
  export let viewBox = '0 0 24 24'
  export let label: string | null = null
  export let strokeWidth = 1.8
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox={viewBox}
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden={label ? undefined : 'true'}
  role={label ? 'img' : undefined}
>
  {#if label}
    <title>{label}</title>
  {/if}
  <slot />
</svg>
