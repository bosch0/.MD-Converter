<script lang="ts">
  import CheckCircleIcon from '../icons/CheckCircleIcon.svelte'
  import FileIcon from '../icons/FileIcon.svelte'
  import LayersIcon from '../icons/LayersIcon.svelte'
  import SparklesIcon from '../icons/SparklesIcon.svelte'
  import type { TranslateFn } from '../../i18n'

  export let resultsCount: number
  export let totalPages: number
  export let convertedCount: number
  export let t: TranslateFn
</script>

<header class="flex items-center justify-between gap-3.5 animate-rise max-820:flex-col max-820:items-start">
  <div class="grid gap-1.5">
    <p
      class="m-0 inline-flex items-center gap-2 justify-self-start rounded-full border border-[rgba(120,146,255,0.36)] bg-[rgba(18,29,52,0.55)] px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.09em] text-[#b6c6ff]"
    >
      <SparklesIcon size={14} />
      <span>{t('workspace.eyebrow')}</span>
    </p>
    <h3 id="library-title" class="m-0 font-heading font-bold text-[clamp(1.45rem,2.4vw,2rem)] text-ink-strong">
      {t('workspace.title')}
    </h3>
    <p class="mb-0 mt-1.5 max-w-[60ch] text-ink-muted">{t('workspace.description')}</p>
  </div>

  {#if resultsCount > 0}
    <div
      class="grid min-w-[min(460px,100%)] grid-cols-[repeat(3,minmax(0,1fr))] gap-2 max-820:min-w-0 max-820:w-full max-820:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]"
    >
      <span
        class="inline-flex min-h-[38px] items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-[rgba(130,150,185,0.22)] bg-[rgba(12,17,30,0.85)] px-[10px] py-[6px] text-[0.84rem] text-ink"
      >
        <FileIcon size={14} />
        <span>{t('workspace.summary.files', { count: resultsCount })}</span>
      </span>
      <span
        class="inline-flex min-h-[38px] items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-[rgba(130,150,185,0.22)] bg-[rgba(12,17,30,0.85)] px-[10px] py-[6px] text-[0.84rem] text-ink"
      >
        <LayersIcon size={14} />
        <span>{t('workspace.summary.pages', { count: totalPages })}</span>
      </span>
      <span
        class="inline-flex min-h-[38px] items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-[rgba(130,150,185,0.22)] bg-[rgba(12,17,30,0.85)] px-[10px] py-[6px] text-[0.84rem] text-ink"
      >
        <CheckCircleIcon size={14} />
        <span>{t('workspace.summary.ready', { count: convertedCount })}</span>
      </span>
    </div>
  {/if}
</header>
