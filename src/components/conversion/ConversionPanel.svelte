<script lang="ts">
  import DownloadIcon from '../icons/DownloadIcon.svelte'
  import type { TranslateFn, TranslationKey } from '../../i18n'
  import type { ConversionStatus } from '../../types/conversion'

  export let filesCount: number
  export let resultsCount: number
  export let conversionStatus: ConversionStatus
  export let progress: number
  export let convertedCount: number
  export let errorMessage: string
  export let onConvert: () => void | Promise<void>
  export let onDownloadAll: (event: MouseEvent) => void | Promise<void>
  export let t: TranslateFn

  const statusKeyMap: Record<ConversionStatus, TranslationKey> = {
    idle: 'conversion.status.idle',
    ready: 'conversion.status.ready',
    converting: 'conversion.status.converting',
    success: 'conversion.status.success',
    error: 'conversion.status.error',
  }

  const getStatusClass = (status: ConversionStatus) => {
    if (status === 'converting') return 'text-[#c6d2ff] border-[rgba(109,134,255,0.35)]'
    if (status === 'success') return 'text-[#a8e8c5] border-[rgba(94,198,141,0.35)]'
    if (status === 'error') return 'text-[#f3b5b5] border-[rgba(224,126,126,0.45)]'
    return ''
  }

  let statusText = ''
  $: statusText =
    conversionStatus === 'ready'
      ? t(statusKeyMap.ready, { count: filesCount })
      : conversionStatus === 'success'
        ? t(statusKeyMap.success, { count: convertedCount })
        : t(statusKeyMap[conversionStatus])
</script>

<div
  class="mx-auto grid w-[min(860px,100%)] gap-4 rounded-[22px] border border-border bg-[rgba(10,16,28,0.72)] p-5 shadow-soft animate-float-in-soft [animation-delay:200ms] max-820:p-[18px]"
>
  <div class="flex flex-wrap items-center gap-2.5 max-560:flex-col max-560:items-stretch">
    <button
      class="focus-ring inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[14px] border border-transparent bg-[linear-gradient(135deg,#6c87ff,#4c69ff)] px-[18px] font-semibold text-[#0a1124] shadow-[0_14px_28px_rgba(76,105,255,0.3)] transition-[transform,border-color,background,box-shadow] duration-[180ms] enabled:hover:-translate-y-[1px] enabled:hover:shadow-[0_18px_32px_rgba(76,105,255,0.4)] disabled:cursor-not-allowed disabled:opacity-[0.55] focus-visible:border-focus-ring-strong cursor-pointer max-560:w-full"
      type="button"
      on:click={onConvert}
      disabled={filesCount === 0 || conversionStatus === 'converting'}
    >
      {conversionStatus === 'converting' ? t('conversion.converting') : t('conversion.convert')}
    </button>

    <button
      class="focus-ring min-h-[44px] rounded-[14px] border border-border bg-[rgba(14,22,36,0.85)] px-[18px] text-ink-strong transition-[transform,border-color,background,box-shadow] duration-[180ms] enabled:hover:-translate-y-[1px] enabled:hover:border-border-strong enabled:hover:bg-[rgba(17,26,42,0.92)] disabled:cursor-not-allowed disabled:opacity-50 disabled:text-ink-muted disabled:border-[rgba(130,150,185,0.16)] disabled:bg-[rgba(12,18,30,0.55)] disabled:shadow-none focus-visible:border-focus-ring-strong cursor-pointer max-560:w-full inline-flex items-center justify-center gap-2"
      type="button"
      on:click={onDownloadAll}
      disabled={resultsCount === 0}
    >
      <DownloadIcon size={16} />
      <span>{t('conversion.downloadAll')}</span>
    </button>
  </div>

  <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 max-820:grid-cols-1">
    <div
      class={`inline-flex min-h-[44px] items-center rounded-[14px] border border-border bg-[rgba(12,17,30,0.72)] px-[14px] py-[10px] text-ink-muted ${getStatusClass(conversionStatus)}`}
    >
      {statusText}
    </div>

    <div class="flex justify-between gap-3 text-[0.9rem] text-ink-muted" aria-live="polite">
      <span>{t('conversion.progress')}</span>
      <span>{progress}%</span>
    </div>
  </div>

  <div class="h-[10px] overflow-hidden rounded-full border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.06)]" aria-hidden="true">
    <div
      class="h-full rounded-full bg-[linear-gradient(90deg,#5d7cff,#d58a5e)] transition-[width] duration-[220ms]"
      style={`width: ${progress}%`}
    ></div>
  </div>

  {#if errorMessage}
    <div
      class="rounded-[14px] border border-[rgba(224,126,126,0.35)] bg-[rgba(80,20,20,0.35)] px-4 py-[14px] text-[#f4c0c0]"
      role="alert"
    >
      {errorMessage}
    </div>
  {/if}
</div>
