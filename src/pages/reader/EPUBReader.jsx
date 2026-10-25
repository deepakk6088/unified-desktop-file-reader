
import { useEffect, useRef, useState } from 'react'
import ePub from 'epubjs'
import { readDocument } from '../../services/fileService.js'
import BookmarkBar from './BookmarkBar.jsx'
import styles from './EPUBReader.module.css'

const fontSizes = { small: '14px', medium: '17px', large: '20px' }
const lineHeights = { compact: '1.45', comfortable: '1.7', relaxed: '1.95' }

function applyReadingTheme(rendition, preferences) {
  if (!rendition) return

  const fontSize = fontSizes[preferences?.fontSize] ?? fontSizes.medium
  const lineHeight = lineHeights[preferences?.lineSpacing] ?? lineHeights.comfortable

  rendition.themes.default({
    body: { 'font-size': fontSize, 'line-height': lineHeight },
    p: { 'line-height': lineHeight },
  })
}

function EPUBReader({ document, preferences }) {
  const viewerRef = useRef(null)
  const renditionRef = useRef(null)
  const preferencesRef = useRef(preferences)

  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState('')
  const [currentLocation, setCurrentLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    preferencesRef.current = preferences
  }, [preferences])

  useEffect(() => {
    let cancelled = false
    let book = null
    let rendition = null

    async function loadBook() {
      setLoading(true)
      setError('')
      setChapters([])
      setCurrentChapter('')
      setCurrentLocation(null)

      try {
        if (!document?.filePath || document.format !== 'EPUB') {
          throw new Error('Select an imported EPUB file from your Library.')
        }

        const buffer = await readDocument(document.filePath)
        if (cancelled) return

        book = ePub(buffer)

        if (!viewerRef.current) {
          throw new Error('The EPUB reader could not be initialized.')
        }

        rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          flow: 'scrolled-doc',
          manager: 'continuous',
        })

        renditionRef.current = rendition
        applyReadingTheme(rendition, preferencesRef.current)

        rendition.on('relocated', (location) => {
          if (cancelled) return

          const start = location?.start
          const cfi = start?.cfi
          const href = start?.href

          if (href) setCurrentChapter(href)

          if (cfi) {
            setCurrentLocation({
              key: `epub-${cfi}`,
              label: `EPUB · ${start?.displayed?.page
                ? `Page ${start.displayed.page}`
                : href.split('#')[0]}`,
              position: { cfi, href },
            })
          }
        })

        const navigation = await book.loaded.navigation
        if (cancelled) return

        setChapters(navigation?.toc ?? [])
        await rendition.display()

        if (!cancelled) setLoading(false)
      } catch (loadError) {
        if (!cancelled) {
          console.error('EPUB loading failed:', loadError)
          setError(loadError instanceof Error
            ? loadError.message
            : 'Could not open this EPUB. The file may be damaged.')
          setLoading(false)
        }
      }
    }

    loadBook()

    return () => {
      cancelled = true
      renditionRef.current = null
      if (book) book.destroy()
    }
  }, [document?.filePath, document?.format, document?.id])

  useEffect(() => {
    applyReadingTheme(renditionRef.current, preferences)
  }, [preferences])

  function openChapter(href) {
    if (!renditionRef.current || !href) return

    renditionRef.current.display(href).catch((chapterError) => {
      console.error('Could not open EPUB chapter:', chapterError)
      setError('Could not open this chapter. Try selecting it again.')
    })
  }

  function jumpToBookmark(bookmark) {
    const position = bookmark?.position
    const rendition = renditionRef.current
    if (!rendition || !position) return

    const target = position.cfi || position.href
    if (!target) return

    setError('')
    rendition.display(target).catch((jumpError) => {
      console.error('Could not open EPUB bookmark:', jumpError)
      setError('Could not open this bookmark. The EPUB structure may have changed.')
    })
  }

  return (
    <section className={styles.epubReader}>
      {chapters.length > 0 && (
        <nav className={styles.contents} aria-label="Table of contents">
          <h3>Contents</h3>
          {chapters.map((chapter) => (
            <button
              key={chapter.id ?? chapter.href}
              type="button"
              className={currentChapter === chapter.href ? styles.activeChapter : ''}
              onClick={() => openChapter(chapter.href)}
            >
              {chapter.label}
            </button>
          ))}
        </nav>
      )}

      <BookmarkBar
        document={document}
        currentLocation={currentLocation}
        onJump={jumpToBookmark}
      />

      <div className={styles.bookArea}>
        {loading && <div className={styles.status} role="status">Loading EPUB…</div>}
        {error && <div className={styles.error} role="alert">
          <strong>Unable to display EPUB</strong>
          <p>{error}</p>
        </div>}
        <div ref={viewerRef} className={styles.bookViewer} aria-label="EPUB document" />
      </div>
    </section>
  )
}

export default EPUBReader
