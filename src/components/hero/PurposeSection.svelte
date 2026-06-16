<script lang="ts">
  import type { TranslateFn } from '../../i18n'

  export let t: TranslateFn
</script>

<article
  class="mx-auto grid w-[min(980px,100%)] gap-4 rounded-[22px] border border-border bg-[rgba(10,16,28,0.72)] p-5 shadow-soft animate-rise-slow max-820:p-[18px]"
>
  <p
    class="mb-1 mt-0 justify-self-start rounded-full border border-[rgba(148,168,214,0.2)] bg-[rgba(10,16,28,0.55)] px-[14px] py-2 text-[0.76rem] uppercase tracking-[0.14em] text-ink-muted"
  >
    {t('purpose.eyebrow')}
  </p>
  <h2
    id="purpose-title"
    class="m-0 font-heading font-bold text-[clamp(1.45rem,2.6vw,2.1rem)] tracking-[-0.03em] text-ink-strong"
  >
    {t('purpose.title')}
  </h2>
  <p class="m-0 max-w-[78ch] text-ink-muted">{t('purpose.description.one')}</p>
  <p class="m-0 max-w-[78ch] text-ink-muted">{t('purpose.description.two')}</p>

  <div class="grid gap-2">
    <p class="text-[0.86rem] uppercase tracking-[0.08em] text-[#b8c7df]">{t('purpose.keywords.label')}</p>
    <ul class="m-0 flex flex-wrap gap-2 p-0 list-none">
      <li
        class="inline-flex min-h-[30px] items-center rounded-full border border-[rgba(130,150,185,0.24)] bg-[rgba(12,17,30,0.84)] px-[10px] py-[5px] text-[0.82rem] text-[#c9d6ec]"
      >
        {t('purpose.keyword.one')}
      </li>
      <li
        class="inline-flex min-h-[30px] items-center rounded-full border border-[rgba(130,150,185,0.24)] bg-[rgba(12,17,30,0.84)] px-[10px] py-[5px] text-[0.82rem] text-[#c9d6ec]"
      >
        {t('purpose.keyword.two')}
      </li>
      <li
        class="inline-flex min-h-[30px] items-center rounded-full border border-[rgba(130,150,185,0.24)] bg-[rgba(12,17,30,0.84)] px-[10px] py-[5px] text-[0.82rem] text-[#c9d6ec]"
      >
        {t('purpose.keyword.three')}
      </li>
      <li
        class="inline-flex min-h-[30px] items-center rounded-full border border-[rgba(130,150,185,0.24)] bg-[rgba(12,17,30,0.84)] px-[10px] py-[5px] text-[0.82rem] text-[#c9d6ec]"
      >
        {t('purpose.keyword.four')}
      </li>
      <li
        class="inline-flex min-h-[30px] items-center rounded-full border border-[rgba(130,150,185,0.24)] bg-[rgba(12,17,30,0.84)] px-[10px] py-[5px] text-[0.82rem] text-[#c9d6ec]"
      >
        {t('purpose.keyword.five')}
      </li>
    </ul>
  </div>
</article>
