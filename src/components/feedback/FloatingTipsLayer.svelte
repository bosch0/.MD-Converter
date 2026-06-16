<script lang="ts">
  import type { FloatingTip } from '../../types/conversion'

  export let floatingTips: FloatingTip[]
</script>

{#each floatingTips as tip (tip.id)}
  <div
    class="fixed z-50 inline-flex min-h-[28px] -translate-x-1/2 -translate-y-[120%] items-center rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.05)] px-[10px] text-[0.78rem] tracking-[0.02em] text-[rgba(240,248,255,0.92)] shadow-[0_10px_24px_rgba(8,12,20,0.22)] pointer-events-none animate-smoke-rise before:absolute before:inset-[-6px_-10px] before:rounded-full before:bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_68%)] before:blur-[4px] before:opacity-[0.85] before:z-[-1]"
    style={`left: ${tip.left}px; top: ${tip.top}px;`}
    aria-live="polite"
  >
    {tip.text}
  </div>
{/each}
