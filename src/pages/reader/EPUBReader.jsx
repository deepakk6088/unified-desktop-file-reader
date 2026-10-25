
import { useEffect, useRef, useState } from 'react'
import ePub from 'epubjs'
import { readDocument } from '../../services/fileService.js'
import styles from './EPUBReader.module.css'

function EPUBReader({ document }) {
  const viewerRef = useRef(null)
  const bookRef = useRef(null)
  const renditionRef = useRef(null)

  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let book

    async function loadBook() {
      setLoading(true)
      setError('')
      setChapters([])
      setCurrentChapter('')

      try {
        if (!document?.filePath || document.format !== 'EPUB') {
          throw new Error('Select an imported EPUB from your Library.')
        }

        const data = await readDocument(document.filePath)

        if (cancelled || !viewerRef.current) return

        book = ePub(data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength,
        ))
        bookRef.current = book

        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          flow: 'scrolled-doc',
          spread: 'none',
        })

        renditionRef.current = rendition

        rendition.on('relocated', (location) => {
          if (!cancelled) {
            setCurrentChapter(location?.start?.href ?? '')
          }
        })

        const navigation = await book.loaded.navigation

        if (!cancelled) {
          setChapters(navigation?.toc ?? [])
        }

        await rendition.display()
      } catch (loadError) {
        if (!cancelled) {
          console.error('EPUB loading failed:', loadError)
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not open this EPUB. The file may be damaged or unsupported.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadBook()

    return () => {
      cancelled = true
      renditionRef.current = null
      bookRef.current = null

      if (book) {
        book.destroy()
      }
    }
  }, [document?.filePath, document?.format])

  async function navigate(direction) {
    const rendition = renditionRef.current
    if (!rendition) return

    try {
      if (direction === 'next') {
        await rendition.next()
      } else {
        await rendition.prev()
      }
    } catch (navigationError) {
      console.error('EPUB navigation failed:', navigationError)
      setError('Could not navigate this EPUB.')
    }
  }

  async function openChapter(href) {
    if (!renditionRef.current || !href) return

    try {
      await renditionRef.current.display(href)
    } catch (navigationError) {
      console.error('Could not open EPUB chapter:', navigationError)
      setError('Could not open this chapter.')
    }
  }

  return (
    <section className={styles.epubReader}>
      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => navigate('previous')}
          disabled={loading}
        >
          Previous
        </button>

        <span>EPUB reader</span>

        <button
          type="button"
          onClick={() => navigate('next')}
          disabled={loading}
        >
          Next
        </button>
      </div>

      {loading && (
        <div className={styles.status} role="status">
          Loading EPUB…
        </div>
      )}

      {!loading && error && (
        <div className={styles.error} role="alert">
          <strong>Unable to display EPUB</strong>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.bookLayout}>
          {chapters.length > 0 && (
            <nav className={styles.contents} aria-label="Book contents">
              <h3>CONTENTS</h3>

              {chapters.map((chapter, index) => (
                <button
                  key={`${chapter.href}-${index}`}
                  type="button"
                  className={
                    currentChapter === chapter.href
                      ? styles.activeChapter
                      : styles.chapter
                  }
                  onClick={() => openChapter(chapter.href)}
                >
                  {chapter.label || `Chapter ${index + 1}`}
                </button>
              ))}
            </nav>
          )}

          <div
            className={styles.bookViewer}
            ref={viewerRef}
            aria-label="EPUB book content"
          />
        </div>
      )}
    </section>
  )
}

export default EPUBReader

