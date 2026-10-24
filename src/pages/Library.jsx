
import styles from './Library.module.css'

function Library() {
  return (
    <section className={styles.library}>
      <div className={styles.intro}>
        <div>
          <div className={styles.eyebrow}>YOUR COLLECTION</div>
          <h2 className={styles.heading}>A little room to read.</h2>
          <p className={styles.subtitle}>
            Your documents, all in one quiet place.
          </p>
        </div>

        <div className={styles.collectionCount}>
          <span className={styles.count}>0</span>
          <span>documents</span>
        </div>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.illustration}>
          <div className={styles.glow} />

          <div className={styles.documentBack} />

          <div className={styles.documentFront}>
            <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path
                d="M13 7.5h15l8 8V40H13V7.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M28 7.5v8h8M19 23h11M19 28h11M19 33h7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className={styles.sparkle} aria-hidden="true">
            ✳
          </div>
        </div>

        <h3 className={styles.emptyTitle}>Your next chapter starts here.</h3>

        <p className={styles.emptyDescription}>
          Your library is ready for its first document.
          <br />
          Supported files will live here when we add file importing.
        </p>

        <div className={styles.formatList} aria-label="Planned formats">
          <span>PDF</span>
          <span>EPUB</span>
          <span>DOCX</span>
        </div>
      </div>

      <footer className={styles.libraryFooter}>
        <span>YOUR SPACE, YOUR PACE</span>
        <span>Made for focused reading.</span>
      </footer>
    </section>
  )
}

export default Library
