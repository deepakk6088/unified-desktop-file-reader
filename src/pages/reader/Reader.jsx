
import PDFReader from './PDFReader.jsx'
import EPUBReader from './EPUBReader.jsx'
import DOCXReader from './DOCXReader.jsx'
import styles from './Reader.module.css'

function Reader({ document, onBack }) {
  const title = document?.title ?? 'A Guide to Focused Reading'
  const format = document?.format ?? 'SAMPLE'
  const category = document?.category ?? 'Reading sample'

  if (document?.isImported) {
    const supportedFormat = ['PDF', 'EPUB', 'DOCX'].includes(format)

    return (
      <div className={styles.reader}>
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
          >
            <span aria-hidden="true">←</span>
            Back to Library
          </button>

          <span className={styles.previewBadge}>
            {supportedFormat ? `${format} READER` : 'UNSUPPORTED FORMAT'}
          </span>
        </div>

        <div className={styles.documentMeta}>
          <span>{category}</span>
          <span className={styles.metaDivider}>/</span>
          <span>{document.fileName ?? title}</span>
        </div>

        <h2>{title}</h2>

        {format === 'PDF' && <PDFReader document={document} />}
        {format === 'EPUB' && <EPUBReader document={document} />}
        {format === 'DOCX' && <DOCXReader document={document} />}

        {!supportedFormat && (
          <article className={styles.paper}>
            <p>
              This file format is not supported. Add a PDF, EPUB, or DOCX
              document to read it here.
            </p>
          </article>
        )}
      </div>
    )
  }

  return (
    <div className={styles.reader}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
        >
          <span aria-hidden="true">←</span>
          Back to Library
        </button>

        <span className={styles.previewBadge}>PREVIEW MODE</span>
      </div>

      <div className={styles.readerLayout}>
        <aside className={styles.contents}>
          <div className={styles.contentsHeading}>ON THIS PAGE</div>

          <button type="button" className={styles.contentsActive}>
            Introduction
          </button>
          <button type="button" className={styles.contentsItem}>
            Building a routine
          </button>
          <button type="button" className={styles.contentsItem}>
            Staying focused
          </button>
          <button type="button" className={styles.contentsItem}>
            Key takeaways
          </button>

          <div className={styles.contentsFooter}>
            <span>Document format</span>
            <strong>{format}</strong>
          </div>
        </aside>

        <article className={styles.paper}>
          <div className={styles.documentMeta}>
            <span>{category}</span>
            <span className={styles.metaDivider}>/</span>
            <span>Sample document</span>
          </div>

          <h2>{title}</h2>

          <p className={styles.subtitle}>
            A sample reading experience for your unified document workspace.
          </p>

          <div className={styles.rule} />

          <h3>Introduction</h3>

          <p>
            A good reading environment helps you spend less time managing
            documents and more time understanding what matters. This preview
            demonstrates the reading layout that will eventually display your
            selected documents.
          </p>

          <p>
            In the finished application, this space will adapt to the document
            format. For now, the content is static sample text so you can
            review the typography, line length, spacing, and reading controls.
          </p>

          <blockquote>
            Make space for focused reading. A simple, consistent environment
            can make returning to a document feel effortless.
          </blockquote>

          <h3>Building a routine</h3>

          <p>
            Break longer reading sessions into manageable sections. Keep the
            interface quiet and the content easy to scan. Progress indicators
            and bookmarks can help you return to the right place without
            searching through the document again.
          </p>

          <div className={styles.pageFooter}>
            <span>Sample content · Not a real document</span>
            <span>01 / 04</span>
          </div>
        </article>
      </div>

      <div className={styles.readingFooter}>
        <div>
          <span className={styles.progressLabel}>READING PROGRESS</span>
          <div className={styles.progressTrack}>
            <span />
          </div>
        </div>

        <span className={styles.progressValue}>25%</span>
      </div>
    </div>
  )
}

export default Reader
