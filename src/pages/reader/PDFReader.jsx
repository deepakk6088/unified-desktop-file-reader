
import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { readPdf } from '../../services/fileService.js'
import {
  loadLibrary,
  saveLibrary,
} from '../../services/libraryService.js'
import BookmarkBar from './BookmarkBar.jsx'
import styles from './PDFReader.module.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

function PDFReader({ document }) {
  const canvasRef = useRef(null)
  const viewerRef = useRef(null)
  const pdfRef = useRef(null)
  const renderTaskRef = useRef(null)
  const progressQueueRef = useRef(Promise.resolve())

  const [pdf, setPdf] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [loading, setLoading] = useState(true)
  const [rendering, setRendering] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let loadedPdf = null

    async function loadPdf() {
      setLoading(true)
      setError('')
      setPdf(null)
      pdfRef.current = null

      try {
        if (!document?.filePath || document.format !== 'PDF') {
          throw new Error('Select an imported PDF from your Library to read it.')
        }

        const data = await readPdf(document.filePath)
        if (cancelled) return

        loadedPdf = await pdfjsLib.getDocument({ data }).promise
        if (cancelled) {
          await loadedPdf.destroy()
          return
        }

        const savedPage = Number.isInteger(document.currentPage)
          ? document.currentPage
          : 1
        const initialPage = Math.min(
          loadedPdf.numPages,
          Math.max(1, savedPage),
        )

        pdfRef.current = loadedPdf
        setPageNumber(initialPage)
        setPdf(loadedPdf)
      } catch (loadError) {
        if (!cancelled) {
          console.error('PDF loading failed:', loadError)
          setError(loadError instanceof Error
            ? loadError.message
            : 'Could not open this PDF.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPdf()

    return () => {
      cancelled = true
      renderTaskRef.current?.cancel()
      pdfRef.current = null
      if (loadedPdf) loadedPdf.destroy().catch(() => {})
    }
  }, [document?.filePath, document?.format, document?.id])

  useEffect(() => {
    if (!pdf || !canvasRef.current) return undefined

    let cancelled = false
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    async function renderPage() {
      setRendering(true)
      try {
        renderTaskRef.current?.cancel()

        const page = await pdf.getPage(pageNumber)
        if (cancelled) return

        const viewport = page.getViewport({ scale: zoom })
        const outputScale = window.devicePixelRatio || 1

        canvas.width = Math.floor(viewport.width * outputScale)
        canvas.height = Math.floor(viewport.height * outputScale)
        canvas.style.width = `${Math.floor(viewport.width)}px`
        canvas.style.height = `${Math.floor(viewport.height)}px`

        const task = page.render({
          canvasContext: context,
          viewport,
          transform: outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null,
        })

        renderTaskRef.current = task
        await task.promise
      } catch (renderError) {
        if (
          renderError?.name !== 'RenderingCancelledException' &&
          !cancelled
        ) {
          console.error('PDF rendering failed:', renderError)
          setError('This page could not be rendered. Try another page or zoom level.')
        }
      } finally {
        if (!cancelled) setRendering(false)
      }
    }

    renderPage()

    return () => {
      cancelled = true
      renderTaskRef.current?.cancel()
    }
  }, [pdf, pageNumber, zoom])

  useEffect(() => {
    if (!pdf || !document?.isImported || !document.id) return

    const progress = Math.min(100, Math.round((pageNumber / pdf.numPages) * 100))

    progressQueueRef.current = progressQueueRef.current
      .catch(() => {})
      .then(async () => {
        const library = await loadLibrary()
        await saveLibrary(library.map((item) =>
          item.id === document.id
            ? { ...item, currentPage: pageNumber, progress }
            : item,
        ))
      })
      .catch((saveError) => {
        console.error('Unable to save PDF progress:', saveError)
      })
  }, [pdf, pageNumber, document?.id, document?.isImported])

  function jumpToBookmark(bookmark) {
    const targetPage = bookmark?.position?.pageNumber
    if (Number.isInteger(targetPage) && pdf) {
      setError('')
      setPageNumber(Math.min(pdf.numPages, Math.max(1, targetPage)))
    }
  }

  function zoomOut() {
    setZoom((value) => Math.max(0.5, Math.round((value - 0.1) * 10) / 10))
  }

  function zoomIn() {
    setZoom((value) => Math.min(2.5, Math.round((value + 0.1) * 10) / 10))
  }

  async function fitWidth() {
    if (!pdf || !viewerRef.current) return

    try {
      const page = await pdf.getPage(pageNumber)
      const width = page.getViewport({ scale: 1 }).width
      const available = viewerRef.current.clientWidth - 48
      setZoom(Math.max(0.5, Math.min(2.5, Math.round((available / width) * 10) / 10)))
    } catch (fitError) {
      console.error('Unable to fit PDF page:', fitError)
      setError('Could not fit this page to the viewer width.')
    }
  }

  return (
    <section className={styles.pdfReader}>
      <div className={styles.controls}>
        <div className={styles.pageControls}>
          <button
            type="button"
            onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
            disabled={!pdf || pageNumber <= 1 || loading}
          >
            Previous
          </button>
          <span>{pdf ? `Page ${pageNumber} of ${pdf.numPages}` : 'Page —'}</span>
          <button
            type="button"
            onClick={() => setPageNumber((page) => Math.min(pdf?.numPages ?? 1, page + 1))}
            disabled={!pdf || pageNumber >= (pdf?.numPages ?? 1) || loading}
          >
            Next
          </button>
        </div>

        <div className={styles.zoomControls}>
          <button type="button" onClick={zoomOut} disabled={!pdf || zoom <= 0.5}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={zoomIn} disabled={!pdf || zoom >= 2.5}>+</button>
          <button type="button" onClick={fitWidth} disabled={!pdf}>Fit width</button>
        </div>
      </div>

      <BookmarkBar
        document={document}
        currentLocation={{
          key: `pdf-page-${pageNumber}`,
          label: `Page ${pageNumber}`,
          position: { pageNumber },
        }}
        onJump={jumpToBookmark}
      />

      <div className={styles.viewer} ref={viewerRef}>
        {loading && <div className={styles.status} role="status">
          <span className={styles.spinner} />
          Loading PDF…
        </div>}

        {!loading && error && <div className={styles.error} role="alert">
          <strong>Unable to display PDF</strong>
          <p>{error}</p>
        </div>}

        {!loading && !error && pdf && (
          <>
            {rendering && <div className={styles.renderStatus} role="status">Rendering page…</div>}
            <canvas
              ref={canvasRef}
              className={styles.pageCanvas}
              aria-label={`Page ${pageNumber} of ${pdf.numPages}`}
            />
          </>
        )}
      </div>
    </section>
  )
}

export default PDFReader
