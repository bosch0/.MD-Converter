<script lang="ts">
  import CheckCircleIcon from '../icons/CheckCircleIcon.svelte'
  import type { TranslateFn } from '../../i18n'

  export let isDragging: boolean
  export let rejectedCount: number
  export let duplicateCount: number
  export let fileInput: HTMLInputElement | null = null
  export let accept: string
  export let onDrop: (event: DragEvent) => void
  export let onDragOver: (event: DragEvent) => void
  export let onDragLeave: () => void
  export let onUploadKeydown: (event: KeyboardEvent) => void
  export let onFileChange: (event: Event) => void
  export let onOpenFileDialog: () => void
  export let recentUploadCount: number
  export let t: TranslateFn
</script>

<div
  class={`w-[min(860px,100%)] rounded-[calc(22px+6px)] bg-[linear-gradient(135deg,rgba(93,124,255,0.2),rgba(213,138,94,0.15))] p-[6px] transition-[transform,box-shadow,filter] duration-[220ms] animate-float-in [animation-delay:140ms] ${isDragging ? 'shadow-[0_20px_54px_rgba(8,12,26,0.6)] -translate-y-1 scale-[1.005] saturate-[1.08]' : ''}`}
  role="button"
  tabindex="0"
  aria-label={t('upload.dropzoneAria')}
  on:drop={onDrop}
  on:dragover={onDragOver}
  on:dragenter={onDragOver}
  on:dragleave={onDragLeave}
  on:keydown={onUploadKeydown}
>
  <div
    class="grid gap-[18px] rounded-[22px] border border-[rgba(145,166,202,0.18)] bg-[radial-gradient(circle_at_top,rgba(93,124,255,0.12),transparent_42%),linear-gradient(180deg,rgba(13,19,31,0.96),rgba(10,15,27,0.92))] p-[30px] shadow-soft max-1040:p-6 max-h-800:p-5"
  >
    <input
      class="absolute h-0 w-0 opacity-0"
      type="file"
      multiple
      {accept}
      bind:this={fileInput}
      on:change={onFileChange}
    />
    <div class="grid justify-items-center gap-[14px] text-center">
      <div>
        <strong class="font-heading text-[1.2rem] text-ink-strong">{t('upload.dragTitle')}</strong>
        <span class="mt-1.5 block text-ink-muted">{t('upload.dragSubtitle')}</span>
      </div>
      <button
        class="focus-ring min-h-[44px] rounded-[14px] border border-transparent bg-[linear-gradient(135deg,#6c87ff,#4c69ff)] px-5 font-semibold text-[#0a1124] shadow-[0_14px_28px_rgba(76,105,255,0.3)] transition-[transform,box-shadow] duration-[180ms] hover:-translate-y-[1px] hover:scale-[1.01] hover:shadow-[0_18px_32px_rgba(76,105,255,0.4)] focus-visible:border-focus-ring-strong cursor-pointer max-560:w-full"
        type="button"
        on:click={onOpenFileDialog}
      >
        {t('upload.selectFiles')}
      </button>
    </div>
    <div class="flex flex-wrap justify-center gap-3 text-[0.85rem] text-ink-muted">
      <span>{t('upload.formats')}</span>
      <span>{t('upload.output')}</span>
    </div>
    {#if recentUploadCount > 0}
      <div
        class="inline-flex min-h-[30px] items-center justify-self-center gap-2 rounded-[10px] border border-[rgba(94,198,141,0.35)] bg-[rgba(20,55,39,0.38)] px-[10px] py-[6px] text-[0.84rem] text-[#ace6c8]"
        aria-live="polite"
      >
        <CheckCircleIcon size={14} />
        <span>{t('upload.added', { count: recentUploadCount })}</span>
      </div>
    {/if}
    {#if rejectedCount > 0}
      <div class="text-[0.85rem] text-[#f0b286]" aria-live="polite">
        {t('upload.rejected', { count: rejectedCount })}
      </div>
    {/if}
    {#if duplicateCount > 0}
      <div class="text-[0.85rem] text-[#f3b5b5]" aria-live="polite">
        {t('upload.duplicate', { count: duplicateCount })}
      </div>
    {/if}
  </div>
</div>
