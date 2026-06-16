<script lang="ts">
  import type { TranslateFn } from '../../i18n'
  import type { ResultItem } from '../../types/conversion'
  import { formatBytes, getFileKindLabel } from '../../utils/file'

  export let results: ResultItem[]
  export let activeResultId: string | null
  export let onSelect: (id: string) => void
  export let onCopy: (event: MouseEvent, result: ResultItem) => void | Promise<void>
  export let onDownload: (event: MouseEvent, result: ResultItem) => void | Promise<void>
  export let t: TranslateFn
</script>

<section
  class="grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] gap-3 rounded-[22px] border border-border bg-[rgba(10,16,28,0.72)] p-[18px] shadow-soft"
>
  <div class="flex items-start justify-between gap-4 border-b border-[rgba(130,150,185,0.2)] pb-[10px] max-820:flex-col">
    <div class="grid gap-1">
      <p class="m-0 text-[0.72rem] uppercase tracking-[0.13em] text-[#90a8ff]">
        {t('step.label', { step: 2 })}
      </p>
      <h3 class="m-0 font-heading font-bold text-[1.15rem] text-ink-strong">{t('results.title')}</h3>
      <p class="mb-0 mt-1.5 text-ink-muted">{t('results.description')}</p>
    </div>
  </div>

  <div
    class="scrollbar-slim grid min-h-0 overflow-auto pr-1 pt-1 max-820:max-h-[300px] max-560:max-h-[292px]"
    class:content-start={results.length > 0}
  >
    {#if results.length === 0}
      <div
        class="grid min-h-full place-items-center rounded-[16px] border border-dashed border-border bg-[rgba(12,17,30,0.6)] p-[22px] text-center text-ink-muted"
      >
        <p class="m-0">{t('results.empty')}</p>
      </div>
    {:else}
      <div class="grid content-start gap-2.5 max-820:grid-cols-1">
        {#each results as result (result.id)}
          <article
            class={`relative grid gap-3 rounded-[16px] border border-border bg-[rgba(8,13,23,0.78)] p-[14px] shadow-soft transition-[transform,border-color,box-shadow] duration-[180ms] hover:-translate-y-[2px] hover:border-[rgba(160,180,210,0.36)] ${activeResultId === result.id ? 'border-[rgba(109,134,255,0.5)] shadow-[0_18px_38px_rgba(10,16,28,0.5)]' : ''} ${result.status === 'error' ? 'border-[rgba(224,126,126,0.4)] bg-[rgba(34,12,16,0.72)]' : ''}`}
          >
            <button
              class="focus-ring grid w-full gap-2 rounded-[12px] border-0 bg-transparent p-0 text-left cursor-pointer focus-visible:border-focus-ring-strong"
              type="button"
              on:click={() => onSelect(result.id)}
            >
              <div class="font-semibold text-ink-strong">{result.file.name}</div>
              <div class="flex flex-wrap gap-2.5 text-[0.84rem] text-ink-muted">
                <span>{getFileKindLabel(result.file, t)}</span>
                <span>
                  {result.status === 'success' ? t('results.pages', { count: result.pages }) : t('results.errorState')}
                </span>
                <span>{formatBytes(result.file.size)}</span>
              </div>
            </button>
            {#if result.status === 'error' && result.errorMessage}
              <p class="mb-0 mt-[-4px] text-[0.82rem] text-[#f2b6b6]" role="status">{result.errorMessage}</p>
            {/if}

            <div class="flex flex-wrap items-center gap-2 max-820:grid max-820:grid-cols-2 max-820:items-stretch max-820:gap-2">
              <button
                class="focus-ring min-h-[38px] rounded-[12px] border border-border bg-[rgba(14,22,36,0.78)] px-[14px] text-ink-strong transition-[transform,border-color,background,box-shadow] duration-[180ms] enabled:hover:-translate-y-[1px] enabled:hover:border-border-strong enabled:hover:bg-[rgba(18,28,44,0.92)] disabled:cursor-not-allowed disabled:opacity-[0.55] disabled:text-ink-muted disabled:border-[rgba(130,150,185,0.16)] disabled:bg-[rgba(12,18,30,0.55)] disabled:shadow-none focus-visible:border-focus-ring-strong cursor-pointer"
                type="button"
                on:click={() => onSelect(result.id)}
              >
                {t('results.preview')}
              </button>
              <button
                class="focus-ring min-h-[38px] rounded-[12px] border border-border bg-[rgba(14,22,36,0.78)] px-[14px] text-ink-strong transition-[transform,border-color,background,box-shadow] duration-[180ms] enabled:hover:-translate-y-[1px] enabled:hover:border-border-strong enabled:hover:bg-[rgba(18,28,44,0.92)] disabled:cursor-not-allowed disabled:opacity-[0.55] disabled:text-ink-muted disabled:border-[rgba(130,150,185,0.16)] disabled:bg-[rgba(12,18,30,0.55)] disabled:shadow-none focus-visible:border-focus-ring-strong cursor-pointer"
                type="button"
                on:click={(event) => onCopy(event, result)}
                disabled={result.status === 'error'}
              >
                {t('results.copy')}
              </button>
              <button
                class="focus-ring min-h-[38px] rounded-[12px] border border-transparent bg-[linear-gradient(135deg,#6c87ff,#4c69ff)] px-[14px] text-[#0a1124] transition-[transform,border-color,background,box-shadow] duration-[180ms] enabled:hover:-translate-y-[1px] enabled:hover:bg-[linear-gradient(135deg,#7a93ff,#5a73ff)] enabled:hover:shadow-[0_10px_22px_rgba(76,105,255,0.34)] disabled:cursor-not-allowed disabled:opacity-[0.55] disabled:text-ink-muted disabled:border-[rgba(130,150,185,0.16)] disabled:bg-[rgba(12,18,30,0.55)] disabled:shadow-none focus-visible:border-focus-ring-strong cursor-pointer max-820:col-span-2"
                type="button"
                on:click={(event) => onDownload(event, result)}
                disabled={result.status === 'error'}
              >
                {t('results.download')}
              </button>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
</section>
