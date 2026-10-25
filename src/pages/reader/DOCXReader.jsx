
import { useEffect, useRef, useState } from 'react'
import mammoth from 'mammoth/mammoth.browser'
import DOMPurify from 'dompurify'
import { readDocument } from '../../services/fileService.js'
import BookmarkBar from './BookmarkBar.jsx'
import styles from './DOCXReader.module.css'

const fontSizes = { small: '13px', medium: '15px', large: '18px' }
const lineHeights = { compact: 1.45, comfortable: 1.7, relaxed: 1.95 }

function DOCXReader({ document, preferences }) {
  const articleRef = useRef(null)
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadDocument() {
      setLoading(true)
      setError('')
      setHtml('')

      try {
        if (!document?.filePath || document.format !== 'DOCX') {
          throw new Error('Select an imported DOCX file from your Library.')
        }

        const data = await readDocument(document.filePath)
        const arrayBuffer = data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength,
        )
        const result = await mammoth.convertToHtml({ arrayBuffer })

        if (cancelled) return

        setHtml(DOMPurify.sanitize(result.value, {
          USE_PROFILES: { html: true },
        }))

        if (result.messages?.length > 0) {
          console.info('DOCX conversion notices:', result.messages)
        }
      } catch (loadError) {
        if (!cancelled) {
          console.error('DOCX loading failed:', loadError)
          setError(loadError instanceof Error
            ? loadError.message
            : 'Could not read this DOCX file. It may be damaged or unsupported.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDocument()
    return () => { cancelled = true }
  }, [document?.filePath, document?.format, document?.id])

  useEffect(() => {
    function updateScrollPosition() {
      const article = articleRef.current
      if (!article) return

      const articleTop = article.getBoundingClientRect().top + window.scrollY
      setScrollPosition(Math.max(0, Math.round(window.scrollY - articleTop)))
    }

    window.addEventListener('scroll', updateScrollPosition, { passive: true })
    updateScrollPosition()

    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [html])

  function jumpToBookmark(bookmark) {
    const savedPosition = bookmark?.position?.scrollTop
    const article = articleRef.current

    if (!article || !Number.isFinite(savedPosition)) return

    const articleTop = article.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: articleTop + Math.max(0, savedPosition),
      behavior: 'auto',
    })
  }

  if (loading) {
    return <div className={styles.status} role="status">Loading Word document…</div>
  }

  if (error) {
    return <div className={styles.error} role="alert">
      <strong>Unable to display DOCX</strong>
      <p>{error}</p>
    </div>
  }

  const fontSize = fontSizes[preferences?.fontSize] ?? fontSizes.medium
  const lineHeight = lineHeights[preferences?.lineSpacing] ?? lineHeights.comfortable
  const readingWidth = preferences?.readingWidth ?? 'comfortable'
  const articleHeight = articleRef.current?.scrollHeight ?? 0
  const percent = articleHeight > 0
    ? Math.min(100, Math.round((scrollPosition / articleHeight) * 100))
    : 0

  return (
    <section className={styles.docxReader}>
      <div className={styles.notice}>
        Word document preview · Formatting may differ from Microsoft Word
      </div>

      <BookmarkBar
        document={document}
        currentLocation={{
          key: `docx-position-${Math.round(scrollPosition / 100) * 100}`,
          label: `DOCX · Around ${percent}%`,
          position: { scrollTop: scrollPosition },
        }}
        onJump={jumpToBookmark}
      />

      <article
        ref={articleRef}
        className={`${styles.document} ${styles[`width-${readingWidth}`]}`}
        style={{ fontSize, lineHeight }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}

export default DOCXReader
