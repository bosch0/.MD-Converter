<script lang="ts">
  import type { TranslateFn } from '../../i18n'
  import type { UploadItem } from '../../types/conversion'
  import { formatBytes, getFileKindLabel } from '../../utils/file'

  export let files: UploadItem[]
  export let onClear: () => void
  export let onRemove: (id: string) => void
  export let t: TranslateFn
</script>

<section
  class="relative z-[2] grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] gap-3 rounded-[22px] border border-border bg-[rgba(10,16,28,0.72)] p-5 shadow-soft max-820:p-[18px]"
  aria-live="polite"
>
  <div class="flex items-end justify-between gap-3 border-b border-[rgba(130,150,185,0.2)] pb-[10px] max-560:flex-col max-560:items-stretch">
    <div class="grid gap-1">
      <p class="m-0 text-[0.72rem] uppercase tracking-[0.13em] text-[#90a8ff]">
        {t('step.label', { step: 1 })}
      </p>
      <h3 class="m-0 font-heading font-bold text-[1.15rem] text-ink-strong">{t('files.title')}</h3>
    </div>
    {#if files.length > 0}
      <button
        class="focus-ring rounded-full border border-border bg-[rgba(10,16,28,0.6)] px-[14px] py-2 text-ink-muted transition-[color,border-color] duration-[180ms] hover:border-border-strong hover:text-ink-strong focus-visible:border-focus-ring-strong cursor-pointer max-560:w-full"
        type="button"
        on:click={onClear}
      >
        {t('files.clear')}
      </button>
    {/if}
  </div>

  <div
    class="scrollbar-slim grid min-h-0 overflow-auto pr-1"
    class:content-start={files.length > 0}
  >
    {#if files.length === 0}
      <div
        class="grid min-h-full place-items-center rounded-[16px] border border-dashed border-border bg-[rgba(12,17,30,0.6)] p-[22px] text-center text-ink-muted"
      >
        <p class="m-0">{t('files.empty')}</p>
      </div>
    {:else}
      <ul class="scrollbar-slim m-0 grid list-none content-start gap-2.5 p-0 [grid-auto-rows:max-content] max-820:max-h-[176px] max-820:overflow-auto max-820:pr-1 max-560:max-h-[170px]">
        {#each files as item (item.id)}
          <li
            class="flex items-center justify-between gap-3 rounded-[16px] border border-border bg-[rgba(10,16,28,0.7)] px-4 py-[14px] shadow-soft"
          >
            <div class="grid gap-1.5 text-left max-820:min-w-0">
              <div class="font-semibold text-ink-strong max-820:truncate">{item.file.name}</div>
              <div class="flex flex-wrap gap-2.5 text-[0.85rem] text-ink-muted">
                <span>{formatBytes(item.file.size)}</span>
                <span>{getFileKindLabel(item.file, t)}</span>
              </div>
            </div>
            <button
              class="focus-ring rounded-full border border-[rgba(224,126,126,0.4)] bg-[rgba(70,18,18,0.45)] px-[14px] py-2 text-[#f2b6b6] transition-[transform,border-color] duration-[180ms] hover:-translate-y-[1px] hover:border-[rgba(224,126,126,0.7)] focus-visible:border-focus-ring-strong cursor-pointer"
              type="button"
              on:click={() => onRemove(item.id)}
            >
              {t('files.remove')}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
