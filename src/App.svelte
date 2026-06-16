<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { SvelteMap } from 'svelte/reactivity'
  import JSZip from 'jszip'
  import { marked } from 'marked'
  import ConversionPanel from './components/conversion/ConversionPanel.svelte'
  import FloatingTipsLayer from './components/feedback/FloatingTipsLayer.svelte'
  import HeroIntro from './components/hero/HeroIntro.svelte'
  import PurposeSection from './components/hero/PurposeSection.svelte'
  import LocaleSwitcher from './components/locale/LocaleSwitcher.svelte'
  import UploadDropzone from './components/upload/UploadDropzone.svelte'
  import FileListPanel from './components/workspace/FileListPanel.svelte'
  import PreviewPanel from './components/workspace/PreviewPanel.svelte'
  import ResultsPanel from './components/workspace/ResultsPanel.svelte'
  import WorkspaceHeader from './components/workspace/WorkspaceHeader.svelte'
  import { FILE_INPUT_ACCEPT } from './config/files'
  import { FLOATING_TIP_DURATION_MS, MAX_FLOATING_TIPS, ZIP_EXPORT_FILE_NAME } from './config/ui'
  import type { Locale } from './i18n'
  import { locale, setLocale, t } from './stores/locale'
  import { convertFile, createErrorResultItem, createResultItem } from './services/conversion'
  import type { ConversionStatus, FloatingTip, PreviewMode, ResultItem, UploadItem } from './types/conversion'
  import { createUploadItemId, isSupportedFile } from './utils/file'
  import { downloadBlob } from './utils/download'
  import { sanitizeHtml } from './utils/sanitize'

  marked.setOptions({ gfm: true, breaks: true })

  let files: UploadItem[] = []
  let results: ResultItem[] = []
  let activeResultId: string | null = null
  let activeResult: ResultItem | null = null
  let successfulResults: ResultItem[] = []
  let previewMode: PreviewMode = 'plain'
  let previewHtml = ''
  let isDragging = false
  let rejectedCount = 0
  let duplicateCount = 0
  let fileInput: HTMLInputElement | null = null
  let conversionStatus: ConversionStatus = 'idle'
  let progress = 0
  let errorMessage = ''
  let convertedCount = 0
  let totalPages = 0
  let uploadFeedbackCount = 0
  let floatingTips: FloatingTip[] = []
  // TODO(domain): replace with the real production domain once it's decided.
  const FALLBACK_CANONICAL_URL = 'https://mdconverter.app/'
  const FALLBACK_SHARE_IMAGE_URL = 'https://mdconverter.app/og-image.png'
  const floatingTipTimers = new SvelteMap<string, ReturnType<typeof setTimeout>>()
  let canonicalUrl = FALLBACK_CANONICAL_URL
  let shareImageUrl = FALLBACK_SHARE_IMAGE_URL
  let seoLocale = 'es_ES'
  let alternateSeoLocale = 'en_US'
  let structuredData = ''
  const currentYear = new Date().getFullYear()
  let sectionObserver: IntersectionObserver | null = null

  const clearFloatingTip = () => {
    for (const timer of floatingTipTimers.values()) {
      clearTimeout(timer)
    }
    floatingTipTimers.clear()
    floatingTips = []
  }

  const showFloatingTip = (text: string, left: number, top: number) => {
    const tipId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const nextTip: FloatingTip = { id: tipId, text, left, top }

    if (floatingTips.length >= MAX_FLOATING_TIPS) {
      const [oldestTip] = floatingTips
      if (oldestTip) {
        const oldestTimer = floatingTipTimers.get(oldestTip.id)
        if (oldestTimer) {
          clearTimeout(oldestTimer)
          floatingTipTimers.delete(oldestTip.id)
        }
      }
      floatingTips = floatingTips.slice(1)
    }

    floatingTips = [...floatingTips, nextTip]

    const timer = setTimeout(() => {
      floatingTips = floatingTips.filter((tip) => tip.id !== tipId)
      floatingTipTimers.delete(tipId)
    }, FLOATING_TIP_DURATION_MS)

    floatingTipTimers.set(tipId, timer)
  }

  const addFiles = (incoming?: FileList | File[]) => {
    if (!incoming) return

    const next = Array.from(incoming)
    const known = new Set(files.map((item) => item.id))
    const nextItems: UploadItem[] = []
    let rejected = 0
    let duplicates = 0

    for (const file of next) {
      if (!isSupportedFile(file)) {
        rejected += 1
        continue
      }

      const id = createUploadItemId(file)
      if (known.has(id) || nextItems.some((item) => item.id === id)) {
        duplicates += 1
        continue
      }
      nextItems.push({ id, file })
    }

    rejectedCount = rejected
    duplicateCount = duplicates
    if (nextItems.length > 0) {
      files = [...files, ...nextItems]
      conversionStatus = 'ready'
      uploadFeedbackCount = nextItems.length
    } else {
      uploadFeedbackCount = 0
    }
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    isDragging = false
    addFiles(event.dataTransfer?.files)
  }

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()
    isDragging = true
  }

  const onDragLeave = () => {
    isDragging = false
  }

  const onFileChange = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement
    addFiles(input.files ?? undefined)
    input.value = ''
  }

  const openFileDialog = () => {
    fileInput?.click()
  }

  const onUploadKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openFileDialog()
    }
  }

  const removeFile = (id: string) => {
    files = files.filter((item) => item.id !== id)
    results = results.filter((item) => item.id !== id)

    clearFloatingTip()

    if (results.length === 0) {
      activeResultId = null
      activeResult = null
      previewMode = 'plain'
    }

    if (files.length === 0) {
      conversionStatus = 'idle'
      progress = 0
      convertedCount = 0
      totalPages = 0
      uploadFeedbackCount = 0
      duplicateCount = 0
      errorMessage = ''
    }
  }

  const clearFiles = () => {
    clearFloatingTip()

    files = []
    results = []
    rejectedCount = 0
    duplicateCount = 0
    conversionStatus = 'idle'
    progress = 0
    convertedCount = 0
    totalPages = 0
    uploadFeedbackCount = 0
    errorMessage = ''
    activeResultId = null
    activeResult = null
    previewMode = 'plain'
  }

  const selectResult = (id: string) => {
    activeResultId = id
  }

  const downloadMarkdown = (result: ResultItem) => {
    if (result.status === 'error') return
    downloadBlob(new Blob([result.markdown], { type: 'text/markdown;charset=utf-8' }), result.downloadName)
  }

  const copyMarkdown = async (result: ResultItem) => {
    if (result.status === 'error') return
    await navigator.clipboard.writeText(result.markdown)
  }

  const handleCopyClick = async (event: MouseEvent, result: ResultItem) => {
    await copyMarkdown(result)
    showFloatingTip($t('tip.copied'), event.clientX, event.clientY)
  }

  const handleDownloadClick = (event: MouseEvent, result: ResultItem) => {
    downloadMarkdown(result)
    showFloatingTip($t('tip.downloaded'), event.clientX, event.clientY)
  }

  const downloadAllMarkdown = async (event: MouseEvent) => {
    if (successfulResults.length === 0) return

    const zip = new JSZip()
    for (const [index, result] of successfulResults.entries()) {
      const prefix = String(index + 1).padStart(2, '0')
      zip.file(`${prefix}-${result.downloadName}`, result.markdown)
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    downloadBlob(blob, ZIP_EXPORT_FILE_NAME)
    showFloatingTip($t('tip.zipReady'), event.clientX, event.clientY)
  }

  const handleConvert = async () => {
    if (files.length === 0) {
      conversionStatus = 'error'
      errorMessage = $t('conversion.error.noFiles')
      return
    }

    conversionStatus = 'converting'
    errorMessage = ''
    results = []
    progress = 0
    convertedCount = 0
    totalPages = 0
    activeResultId = null
    activeResult = null

    const nextResults: ResultItem[] = []
    const totalFiles = files.length
    let pageCountSum = 0
    let successCount = 0
    let failedCount = 0

    for (let fileIndex = 0; fileIndex < files.length; fileIndex += 1) {
      const item = files[fileIndex]

      try {
        const converted = await convertFile(
          item,
          (pageIndex, pageTotal) => {
            const fileProgress = Math.min(1, pageIndex / Math.max(pageTotal, 1))
            const baseProgress = fileIndex / totalFiles
            progress = Math.round((baseProgress + fileProgress / totalFiles) * 100)
          },
          $t,
        )

        nextResults.push(createResultItem(item.id, item.file, converted, $t))
        pageCountSum += converted.pages
        successCount += 1
      } catch (error) {
        nextResults.push(createErrorResultItem(item.id, item.file, error, $t))
        failedCount += 1
      }

      progress = Math.round(((fileIndex + 1) / totalFiles) * 100)
    }

    results = nextResults
    convertedCount = successCount
    totalPages = pageCountSum
    activeResultId = nextResults[0]?.id ?? null
    progress = 100

    if (failedCount === 0) {
      conversionStatus = 'success'
      errorMessage = ''
      return
    }

    if (successCount === 0) {
      conversionStatus = 'error'
      errorMessage = $t('conversion.error.allFailed', { count: failedCount })
      return
    }

    conversionStatus = 'success'
    errorMessage = $t('conversion.error.partial', { count: failedCount })
  }

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale, { persist: true })
  }

  const scrollToOutputRoom = (event: MouseEvent) => {
    event.preventDefault()
    const outputRoom = document.getElementById('output-room')
    if (!outputRoom) return
    const top = outputRoom.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }

  onMount(() => {
    canonicalUrl = `${window.location.origin}${window.location.pathname}`
    shareImageUrl = `${window.location.origin}/og-image.png`

    const sections = Array.from(document.querySelectorAll<HTMLElement>('.reveal-section'))
    if (sections.length === 0) return

    document.documentElement.classList.add('has-scroll-animations')
    sections.forEach((section, index) => {
      section.style.setProperty('--reveal-delay', `${Math.min(index * 80, 200)}ms`)
    })

    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'))
      return
    }

    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            sectionObserver?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.22,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    sections.forEach((section) => sectionObserver?.observe(section))
  })

  $: if (results.length > 0 && (!activeResultId || !results.some((item) => item.id === activeResultId))) {
    activeResultId = results[0].id
  }

  $: activeResult = activeResultId ? results.find((item) => item.id === activeResultId) ?? null : null
  $: successfulResults = results.filter((item) => item.status === 'success')
  $: previewHtml =
    activeResult && activeResult.status === 'success' && previewMode === 'rendered'
      ? sanitizeHtml(marked.parse(activeResult.markdown) as string)
      : ''

  $: seoLocale = $locale === 'es' ? 'es_ES' : 'en_US'
  $: alternateSeoLocale = $locale === 'es' ? 'en_US' : 'es_ES'
  $: if (typeof document !== 'undefined') {
    document.documentElement.lang = $locale
  }
  // English alternate is a real, distinct URL (not just metadata) because `?lang=` is read by
  // the locale store on init (see stores/locale.ts) — so hreflang here matches what's served.
  $: enAlternateUrl = `${canonicalUrl}?lang=en`
  $: structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MD Converter',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    inLanguage: $locale,
    url: canonicalUrl,
    description: $t('app.description'),
    keywords: $t('app.keywords'),
  })

  onDestroy(() => {
    clearFloatingTip()
    sectionObserver?.disconnect()
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('has-scroll-animations')
    }
  })
</script>

<svelte:head>
  <title>{$t('app.title')}</title>
  <meta name="description" content={$t('app.description')} />
  <meta name="keywords" content={$t('app.keywords')} />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
  <meta name="author" content="MD Converter" />
  <meta name="application-name" content="MD Converter" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="MD Converter" />
  <meta property="og:title" content={$t('app.title')} />
  <meta property="og:description" content={$t('app.description')} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={shareImageUrl} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={$t('app.title')} />
  <meta property="og:locale" content={seoLocale} />
  <meta property="og:locale:alternate" content={alternateSeoLocale} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={$t('app.title')} />
  <meta name="twitter:description" content={$t('app.description')} />
  <meta name="twitter:image" content={shareImageUrl} />
  <link rel="canonical" href={canonicalUrl} />
  <link rel="alternate" hreflang="es" href={canonicalUrl} />
  <link rel="alternate" hreflang="en" href={enAlternateUrl} />
  <link rel="alternate" hreflang="x-default" href={canonicalUrl} />
  <!-- A literal <script> tag in markup is treated as raw/foreign content by Svelte (its children
       aren't evaluated as expressions), so the tag itself is built as a string and injected whole.
       structuredData is JSON.stringify of our own i18n strings, never user input. -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<script type="application/ld+json">${structuredData}</scri` + `pt>`}
</svelte:head>

<div class="relative min-h-screen overflow-hidden">
  <div
    class="absolute left-[-120px] top-[-140px] h-[360px] w-[360px] rounded-[999px] bg-[rgba(93,124,255,0.2)] opacity-90 blur-[40px] pointer-events-none animate-glow-bob"
  ></div>
  <div
    class="absolute right-[-140px] top-[40px] h-[420px] w-[420px] rounded-[999px] bg-[rgba(213,138,94,0.2)] opacity-90 blur-[40px] pointer-events-none animate-glow-bob [animation-duration:18s]"
  ></div>
  <div
    class="absolute bottom-[-200px] left-[20%] h-[520px] w-[520px] rounded-[999px] bg-[rgba(93,124,255,0.14)] opacity-90 blur-[40px] pointer-events-none animate-glow-bob [animation-duration:20s]"
  ></div>
  <div
    class="fixed right-[clamp(12px,2vw,22px)] top-[clamp(12px,2vw,20px)] z-[35] rounded-full border border-[rgba(152,172,208,0.24)] bg-[rgba(8,13,23,0.62)] p-1 backdrop-blur-[10px] shadow-[0_14px_32px_rgba(4,8,16,0.45)] max-560:right-[10px] max-560:top-[10px]"
  >
    <LocaleSwitcher currentLocale={$locale} onChange={handleLocaleChange} t={$t} />
  </div>

  <section
    class="reveal-section relative flex min-h-screen items-center p-[clamp(18px,2.5vw,30px)] isolate max-820:min-h-[100svh] max-820:p-4"
    aria-labelledby="hero-title"
  >
    <main
      class="relative z-[2] mx-auto grid w-[min(1160px,100%)] content-center justify-items-center gap-[22px] pb-5 text-center max-820:mt-[56px] max-820:gap-4 max-560:mt-[62px] max-h-800:gap-3"
    >
      <HeroIntro t={$t} />
      <UploadDropzone
        {isDragging}
        {rejectedCount}
        {duplicateCount}
        recentUploadCount={uploadFeedbackCount}
        bind:fileInput
        accept={FILE_INPUT_ACCEPT}
        {onDrop}
        {onDragOver}
        {onDragLeave}
        {onUploadKeydown}
        {onFileChange}
        onOpenFileDialog={openFileDialog}
        t={$t}
      />
      <ConversionPanel
        filesCount={files.length}
        resultsCount={successfulResults.length}
        {conversionStatus}
        {progress}
        {convertedCount}
        {errorMessage}
        onConvert={handleConvert}
        onDownloadAll={downloadAllMarkdown}
        t={$t}
      />
      <a
        class="focus-ring mt-4 inline-flex min-h-[30px] items-center gap-2 rounded-full border border-[rgba(130,150,185,0.1)] bg-[rgba(10,16,28,0.08)] px-2 py-1 text-[0.8rem] tracking-[0.01em] text-[#b9c8e3] no-underline animate-pulse-glow [animation-delay:260ms] hover:border-[rgba(155,176,222,0.18)] hover:bg-[rgba(10,16,28,0.14)] focus-visible:border-focus-ring-strong max-820:mt-5 max-560:mt-[22px]"
        href="#output-room"
        aria-label={$t('hero.scrollHint')}
        on:click={scrollToOutputRoom}
      >
        <span class="whitespace-nowrap leading-none">{$t('hero.scrollHint')}</span>
        <span class="text-[0.95rem] leading-none animate-cue-bounce" aria-hidden="true">↓</span>
      </a>
    </main>
  </section>

  <section
    id="output-room"
    class="reveal-section relative flex min-h-screen items-center p-[clamp(18px,2.5vw,30px)] pt-[clamp(10px,1vw,16px)] pb-[clamp(24px,3vw,36px)] max-820:min-h-[100svh] max-820:p-4"
    aria-labelledby="library-title"
  >
    <div
      class="relative z-[2] mx-auto grid h-[min(860px,calc(100vh_-_clamp(34px,_6vh,_72px)))] w-[min(1240px,100%)] grid-rows-[auto_minmax(0,1fr)] gap-[14px] max-1040:h-auto max-h-800:h-[min(780px,calc(100vh_-_24px))]"
    >
      <WorkspaceHeader
        resultsCount={results.length}
        {totalPages}
        {convertedCount}
        t={$t}
      />

      <div class="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_minmax(360px,0.94fr)] items-stretch gap-[14px] max-1040:grid-cols-1">
        <div class="grid min-h-0 grid-rows-[minmax(0,0.84fr)_minmax(0,1.16fr)] gap-[14px]">
          <FileListPanel files={files} onClear={clearFiles} onRemove={removeFile} t={$t} />
          <ResultsPanel
            {results}
            {activeResultId}
            onSelect={selectResult}
            onCopy={handleCopyClick}
            onDownload={handleDownloadClick}
            t={$t}
          />
        </div>

        <PreviewPanel
          {activeResult}
          {previewMode}
          {previewHtml}
          onSetPreviewMode={(mode) => (previewMode = mode)}
          t={$t}
        />
      </div>
    </div>
  </section>

  <section
    class="reveal-section relative flex min-h-screen items-center p-[clamp(18px,2.5vw,30px)] isolate max-820:min-h-[100svh] max-820:p-4"
    aria-labelledby="purpose-title"
  >
    <PurposeSection t={$t} />
  </section>

  <footer class="relative z-[2] mx-auto w-[min(1240px,100%)] px-[clamp(18px,2.5vw,30px)] pb-[clamp(22px,3.5vw,38px)] pt-0">
    <div
      class="grid gap-2.5 rounded-[22px] border border-[rgba(130,150,185,0.22)] bg-[linear-gradient(145deg,rgba(19,28,48,0.9),rgba(10,16,28,0.86)),radial-gradient(circle_at_85%_20%,rgba(109,134,255,0.2),transparent_45%)] p-[18px] shadow-soft"
    >
      <p class="m-0 font-heading text-[clamp(1.05rem,1.5vw,1.3rem)] text-ink-strong">MD Converter</p>
      <p class="m-0 text-ink-muted">{$t('footer.description')}</p>
      <div class="flex flex-wrap gap-2">
        <span
          class="inline-flex min-h-[28px] items-center rounded-full border border-[rgba(130,150,185,0.28)] bg-[rgba(12,17,30,0.66)] px-[10px] py-1 text-[0.8rem] text-[#c6d5ee]"
        >
          {$t('footer.tag.ai')}
        </span>
        <span
          class="inline-flex min-h-[28px] items-center rounded-full border border-[rgba(130,150,185,0.28)] bg-[rgba(12,17,30,0.66)] px-[10px] py-1 text-[0.8rem] text-[#c6d5ee]"
        >
          {$t('footer.tag.agents')}
        </span>
        <span
          class="inline-flex min-h-[28px] items-center rounded-full border border-[rgba(130,150,185,0.28)] bg-[rgba(12,17,30,0.66)] px-[10px] py-1 text-[0.8rem] text-[#c6d5ee]"
        >
          {$t('footer.tag.rag')}
        </span>
      </div>
      <p class="m-0 text-[0.86rem] text-ink-muted">{$t('footer.copy', { year: currentYear })}</p>
    </div>
  </footer>

  <FloatingTipsLayer {floatingTips} />
</div>
