<script lang="ts">
  import CodeIcon from '../icons/CodeIcon.svelte'
  import EyeIcon from '../icons/EyeIcon.svelte'
  import type { TranslateFn } from '../../i18n'
  import type { PreviewMode, ResultItem } from '../../types/conversion'

  export let activeResult: ResultItem | null
  export let previewMode: PreviewMode
  export let previewHtml: string
  export let onSetPreviewMode: (mode: PreviewMode) => void
  export let t: TranslateFn

  let canRenderMarkdown = false
  $: canRenderMarkdown = Boolean(activeResult && activeResult.status === 'success')
</script>

<section
  class="relative grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] gap-3 rounded-[22px] border border-border bg-[rgba(10,16,28,0.72)] p-[18px] shadow-soft max-1040:static"
>
  <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(130,150,185,0.2)] pb-[10px] max-820:flex-col">
    <div class="grid gap-1">
      <p class="m-0 text-[0.72rem] uppercase tracking-[0.13em] text-[#90a8ff]">
        {t('step.label', { step: 3 })}
      </p>
      <h3 class="m-0 font-heading font-bold text-[1.15rem] text-ink-strong">{t('preview.title')}</h3>
      <p class="mb-0 mt-1.5 text-ink-muted">{activeResult ? activeResult.file.name : t('preview.emptySelection')}</p>
    </div>

    <div
      class="grid w-full grid-cols-2 items-center gap-1.5 rounded-[14px] border border-[rgba(130,150,185,0.22)] bg-[rgba(8,13,23,0.68)] p-1 max-820:mx-auto max-820:w-[min(100%,420px)]"
    >
      <button
        class={`focus-ring inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[12px] border border-border bg-[rgba(14,22,36,0.78)] px-[14px] text-ink-strong transition-[transform,border-color,background,box-shadow] duration-[180ms] disabled:cursor-not-allowed disabled:opacity-[0.55] disabled:text-ink-muted disabled:border-[rgba(130,150,185,0.16)] disabled:bg-[rgba(12,18,30,0.55)] disabled:shadow-none focus-visible:border-focus-ring-strong cursor-pointer max-820:min-h-[42px] max-820:px-2.5 max-820:text-[0.84rem] ${
          activeResult && previewMode === 'plain'
            ? 'border-transparent bg-[linear-gradient(135deg,#6c87ff,#4c69ff)] text-[#0a1124]'
            : 'enabled:hover:-translate-y-[1px] enabled:hover:border-[rgba(149,170,224,0.62)] enabled:hover:bg-[linear-gradient(180deg,rgba(21,33,53,0.95),rgba(15,24,40,0.95))] enabled:hover:shadow-[0_10px_20px_rgba(8,13,22,0.3)]'
        }`}
        type="button"
        on:click={() => onSetPreviewMode('plain')}
        disabled={!activeResult}
      >
        <CodeIcon size={15} />
        <span class="overflow-hidden text-ellipsis whitespace-nowrap leading-none">{t('preview.mode.plain')}</span>
      </button>
      <button
        class={`focus-ring inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[12px] border border-border bg-[rgba(14,22,36,0.78)] px-[14px] text-ink-strong transition-[transform,border-color,background,box-shadow] duration-[180ms] disabled:cursor-not-allowed disabled:opacity-[0.55] disabled:text-ink-muted disabled:border-[rgba(130,150,185,0.16)] disabled:bg-[rgba(12,18,30,0.55)] disabled:shadow-none focus-visible:border-focus-ring-strong cursor-pointer max-820:min-h-[42px] max-820:px-2.5 max-820:text-[0.84rem] ${
          activeResult && previewMode === 'rendered'
            ? 'border-transparent bg-[linear-gradient(135deg,#6c87ff,#4c69ff)] text-[#0a1124]'
            : 'enabled:hover:-translate-y-[1px] enabled:hover:border-[rgba(149,170,224,0.62)] enabled:hover:bg-[linear-gradient(180deg,rgba(21,33,53,0.95),rgba(15,24,40,0.95))] enabled:hover:shadow-[0_10px_20px_rgba(8,13,22,0.3)]'
        }`}
        type="button"
        on:click={() => onSetPreviewMode('rendered')}
        disabled={!canRenderMarkdown}
      >
        <EyeIcon size={15} />
        <span class="overflow-hidden text-ellipsis whitespace-nowrap leading-none">{t('preview.mode.rendered')}</span>
      </button>
    </div>
  </div>

  <div class="grid min-h-0 max-w-full overflow-hidden max-1040:max-h-[min(56svh,520px)] max-820:max-h-[min(50svh,360px)] max-560:max-h-[min(46svh,320px)]">
    {#if activeResult}
      {#if activeResult.status === 'error'}
        <div
          class="grid gap-2 rounded-[16px] border border-[rgba(224,126,126,0.4)] bg-[rgba(80,20,20,0.28)] p-[18px] text-[#f4c0c0]"
          role="alert"
        >
          <p class="m-0">{t('preview.errorBody')}</p>
          <p class="m-0">{activeResult.errorMessage ?? t('conversion.error.generic')}</p>
        </div>
      {:else if previewMode === 'plain'}
        <pre
          class="scrollbar-slim m-0 h-full min-h-0 max-h-full max-w-full overflow-auto break-words rounded-[16px] border border-border bg-[rgba(7,11,20,0.88)] p-[18px] text-[0.9rem] leading-[1.7] text-[#dbe6f8] whitespace-pre-wrap font-mono [overflow-wrap:anywhere]"
        >
          {activeResult.markdown}
        </pre>
      {:else}
        <article
          class="markdown-render scrollbar-slim m-0 h-full min-h-0 max-h-full max-w-full overflow-auto break-words rounded-[16px] border border-border bg-[rgba(7,11,20,0.88)] p-[18px] text-[0.9rem] leading-[1.7] text-[#dbe6f8] [overflow-wrap:anywhere]"
          aria-label={t('preview.renderedAria')}
        >
          <!-- eslint-disable-next-line svelte/no-at-html-tags -- previewHtml is sanitized via dompurify in utils/sanitize.ts -->
          {@html previewHtml}
        </article>
      {/if}
    {:else}
      <div
        class="grid place-items-center rounded-[16px] border border-border bg-[rgba(12,17,30,0.6)] p-[22px] text-center text-ink-muted"
      >
        <p class="m-0">{t('preview.emptyBody')}</p>
      </div>
    {/if}
  </div>
</section>
