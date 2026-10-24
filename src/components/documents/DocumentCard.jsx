import styles from './DocumentCard.module.css'

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3.75h8l4 4v12.5H6z" />
      <path d="M14 3.75v4h4M9 12h6M9 15.5h6" />
    </svg>
  )
}

function DocumentCard({ document, view = 'grid', onOpen }) {
  const isList = view === 'list'

  return (
    <button
      type="button"
      className={`${styles.card} ${isList ? styles.listCard : ''}`}
      onClick={() => onOpen(document)}
      aria-label={`Open ${document.title}`}
    >
      <div className={`${styles.cover} ${styles[document.color]}`}>
        <DocumentIcon />
        <span>{document.format}</span>
      </div>

      <div className={styles.details}>
        <div className={styles.titleRow}>
          <h3 title={document.title}>{document.title}</h3>
          <span className={styles.format}>{document.format}</span>
        </div>

        <p className={styles.category}>
          {document.category} <span>·</span> {document.author}
        </p>

        <p className={styles.updated}>{document.updatedAt}</p>

        <div className={styles.progressTrack} aria-hidden="true">
          <span style={{ width: `${document.progress}%` }} />
        </div>

        <div className={styles.progressLabel}>
          {document.progress > 0
            ? `${document.progress}% read`
            : 'Not started'}
        </div>
      </div>
    </button>
  )
}

export default DocumentCard