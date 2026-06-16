<script lang="ts">
  import GlobeIcon from '../icons/GlobeIcon.svelte'
  import type { Locale, TranslateFn } from '../../i18n'

  export let currentLocale: Locale
  export let onChange: (locale: Locale) => void
  export let t: TranslateFn

  const localeOptions: Locale[] = ['es', 'en']

  const getLocaleLabel = (locale: Locale) => (locale === 'es' ? t('locale.es') : t('locale.en'))
</script>

<div
  class="inline-flex items-center gap-1 rounded-full border border-border bg-[rgba(12,17,30,0.72)] p-1"
  role="group"
  aria-label={t('locale.ariaLabel')}
>
  <span class="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#a6b7ff]" aria-hidden="true">
    <GlobeIcon size={14} />
  </span>
  {#each localeOptions as localeOption (localeOption)}
    <button
      class={`focus-ring min-h-[32px] min-w-[44px] rounded-full px-3 text-ink-muted transition-[background,color,transform] duration-[180ms] hover:-translate-y-[1px] hover:text-ink-strong focus-visible:border-focus-ring-strong cursor-pointer ${currentLocale === localeOption ? 'bg-[linear-gradient(135deg,#6c87ff,#4c69ff)] text-[#0a1124]' : ''}`}
      type="button"
      aria-pressed={currentLocale === localeOption}
      on:click={() => onChange(localeOption)}
    >
      {getLocaleLabel(localeOption)}
    </button>
  {/each}
</div>
