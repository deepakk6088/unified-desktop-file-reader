import { useEffect, useState } from 'react'
import mammoth from 'mammoth/mammoth.browser'
import DOMPurify from 'dompurify'
import { readDocument } from '../../services/fileService.js'
import styles from './DOCXReader.module.css'

const fontSizes = {
  small: '13px',
  medium: '15px',
  large: '18px',
}

const lineHeights = {
  compact: 1.45,
  comfortable: 1.7,
  relaxed: 1.95,
}

function DOCXReader({ document, preferences }) {
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

        const safeHtml = DOMPurify.sanitize(result.value, {
          USE_PROFILES: { html: true },
        })

        setHtml(safeHtml)

        if (result.messages?.length > 0) {
          console.info('DOCX conversion notices:', result.messages)
        }
      } catch (loadError) {
        if (!cancelled) {
          console.error('DOCX loading failed:', loadError)

          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not read this DOCX file. It may be damaged or unsupported.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDocument()

    return () => {
      cancelled = true
    }
  }, [document?.filePath, document?.format])

  if (loading) {
    return (
      <div className={styles.status} role="status">
        Loading Word document…
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        <strong>Unable to display DOCX</strong>
        <p>{error}</p>
      </div>
    )
  }

  const fontSize = fontSizes[preferences?.fontSize] ?? fontSizes.medium
  const lineHeight =
    lineHeights[preferences?.lineSpacing] ?? lineHeights.comfortable
  const readingWidth = preferences?.readingWidth ?? 'comfortable'

  return (
    <section className={styles.docxReader}>
      <div className={styles.notice}>
        Word document preview · Formatting may differ from Microsoft Word
      </div>

      <article
        className={`${styles.document} ${styles[`width-${readingWidth}`]}`}
        style={{ fontSize, lineHeight }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}

export default DOCXReader