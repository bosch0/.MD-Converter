<script lang="ts">
  import type { TranslateFn } from '../../i18n'

  export let t: TranslateFn
</script>

<div class="grid justify-items-center gap-[10px] animate-rise [animation-delay:80ms]">
  <div class="flex w-full items-center justify-center gap-3">
    <p
      class="m-0 justify-self-center rounded-full border border-[rgba(148,168,214,0.2)] bg-[rgba(10,16,28,0.55)] px-[14px] py-2 text-[0.76rem] uppercase tracking-[0.14em] text-ink-muted"
    >
      {t('hero.eyebrow')}
    </p>
  </div>

  <!-- Semantic h1/h2 are swapped relative to their visual size on purpose: the h1 carries the
       keyword-rich line ("PDF/DOCX to Markdown") for SEO, while the brand name stays an h2.
       Visual styling (font size, gradient) is preserved per element so nothing looks different. -->
  <h2 class="m-0 font-heading font-bold text-[clamp(2.6rem,5vw,4.6rem)] tracking-[-0.03em]">
    <span class="bg-[linear-gradient(90deg,#5d7cff,#d58a5e)] bg-clip-text text-transparent">
      {t('hero.title')}
    </span>
  </h2>
  <h1 id="hero-title" class="m-0 font-heading font-bold text-[clamp(2.2rem,4.2vw,3.6rem)] tracking-[-0.03em] text-ink-strong">
    {t('hero.subtitle')}
  </h1>
  <p class="mb-0 mt-3 max-w-[58ch] text-[1.05rem] text-ink-muted max-820:text-[1rem] max-h-800:text-[0.98rem]">
    {t('hero.description')}
  </p>
</div>
