import { useState } from 'react'
import styles from './Library.module.css'

const documents = [
  {
    id: 1,
    title: 'The Art of Deep Work',
    author: 'Reading notes',
    format: 'PDF',
    category: 'Productivity',
    updated: 'Opened yesterday',
    color: 'violet',
    progress: 68,
  },
  {
    id: 2,
    title: 'JavaScript Patterns',
    author: 'Development',
    format: 'EPUB',
    category: 'Technology',
    updated: 'Opened 2 days ago',
    color: 'amber',
    progress: 32,
  },
  {
    id: 3,
    title: 'Project Proposal',
    author: 'Personal documents',
    format: 'DOCX',
    category: 'Work',
    updated: 'Added 4 days ago',
    color: 'blue',
    progress: 0,
  },
  {
    id: 4,
    title: 'Designing Interfaces',
    author: 'Design references',
    format: 'PDF',
    category: 'Design',
    updated: 'Opened last week',
    color: 'green',
    progress: 84,
  },
]

const filters = ['All', 'PDF', 'EPUB', 'DOCX']

function DocumentGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3.75h8l4 4v12.5H6z" />
      <path d="M14 3.75v4h4M9 12h6M9 15.5h6" />
    </svg>
  )
}

function Library({ onOpenDocument }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredDocuments = documents.filter(
    (document) =>
      activeFilter === 'All' || document.format === activeFilter,
  )

  return (
    <div className={styles.library}>
      <section className={styles.welcome}>
        <div>
          <div className={styles.eyebrow}>YOUR READING SPACE</div>
          <h2>Pick up where you left off.</h2>
          <p>Your documents and reading progress, all in one place.</p>
        </div>

        <div className={styles.documentCount}>
          <span>{documents.length}</span>
          <span>Sample documents</span>
        </div>
      </section>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h3>Your documents</h3>
            <p>Example content to preview your library.</p>
          </div>

          <div className={styles.filters} aria-label="Filter documents">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={
                  activeFilter === filter ? styles.filterActive : ''
                }
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className={styles.documentGrid}>
            {filteredDocuments.map((document) => (
              <button
                key={document.id}
                type="button"
                className={styles.documentCard}
                onClick={() => onOpenDocument(document)}
              >
                <div
                  className={`${styles.cover} ${
                    styles[document.color]
                  }`}
                >
                  <DocumentGlyph />
                  <span>{document.format}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardTitleRow}>
                    <h4>{document.title}</h4>
                    <span className={styles.formatTag}>
                      {document.format}
                    </span>
                  </div>

                  <p className={styles.category}>{document.category}</p>
                  <p className={styles.updated}>{document.updated}</p>

                  <div className={styles.progressTrack}>
                    <span
                      style={{ width: `${document.progress}%` }}
                    />
                  </div>

                  <div className={styles.progressLabel}>
                    {document.progress > 0
                      ? `${document.progress}% read`
                      : 'Not started'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <DocumentGlyph />
            </div>
            <h3>No {activeFilter} documents yet</h3>
            <p>
              This filter has no sample documents. Select another format
              to explore the library preview.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('All')}
            >
              Show all documents
            </button>
          </div>
        )}
      </section>

      <div className={styles.notice}>
        <span className={styles.noticeDot} />
        These are sample entries for interface preview. No files have
        been imported or opened.
      </div>
    </div>
  )
}

export default Library