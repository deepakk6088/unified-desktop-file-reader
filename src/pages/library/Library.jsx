import { useState } from 'react'
import sampleDocuments from '../../data/sampleDocuments.js'
import DocumentCard from '../../components/documents/DocumentCard.jsx'
import styles from './Library.module.css'

const filters = ['All', 'PDF', 'EPUB', 'DOCX']

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r=".7" />
      <circle cx="4.5" cy="12" r=".7" />
      <circle cx="4.5" cy="18" r=".7" />
    </svg>
  )
}

function EmptyState({ isSearch, onReset }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <SearchIcon />
      </div>

      <h3>
        {isSearch ? 'No matching documents' : 'Your library is empty'}
      </h3>

      <p>
        {isSearch
          ? 'Try a different title, author, category, or format.'
          : 'Your documents will appear here when document importing is implemented.'}
      </p>

      <button type="button" onClick={onReset}>
        {isSearch ? 'Clear search and filters' : 'Reset library view'}
      </button>
    </div>
  )
}

function Library({ onOpenDocument }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [view, setView] = useState('grid')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredDocuments = sampleDocuments.filter((document) => {
    const matchesSearch = [
      document.title,
      document.author,
      document.category,
      document.format,
    ].some((value) => value.toLowerCase().includes(normalizedQuery))

    const matchesFormat =
      activeFilter === 'All' || document.format === activeFilter

    return matchesSearch && matchesFormat
  })

  const hasDocuments = sampleDocuments.length > 0
  const hasFilters = normalizedQuery !== '' || activeFilter !== 'All'

  function resetFilters() {
    setSearchQuery('')
    setActiveFilter('All')
  }

  return (
    <div className={styles.library}>
      <section className={styles.welcome}>
        <div>
          <div className={styles.eyebrow}>YOUR READING SPACE</div>
          <h2>Pick up where you left off.</h2>
          <p>
            Find your documents and get back to what you were reading.
          </p>
        </div>

        <div className={styles.documentCount}>
          <span>{sampleDocuments.length}</span>
          <span>Sample documents</span>
        </div>
      </section>

      <section className={styles.documentsSection}>
        <div className={styles.sectionHeading}>
          <div>
            <h3>Your documents</h3>
            <p>
              {filteredDocuments.length} of {sampleDocuments.length} documents
            </p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <SearchIcon />
            <input
              type="search"
              placeholder="Search by title, author, category..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search documents"
            />

            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <div className={styles.toolbarRight}>
            <div className={styles.filters} aria-label="Filter by format">
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

            <div className={styles.viewSwitch} aria-label="Document layout">
              <button
                type="button"
                className={view === 'grid' ? styles.viewActive : ''}
                onClick={() => setView('grid')}
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
              >
                <GridIcon />
              </button>

              <button
                type="button"
                className={view === 'list' ? styles.viewActive : ''}
                onClick={() => setView('list')}
                aria-label="List view"
                aria-pressed={view === 'list'}
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        {!hasDocuments || filteredDocuments.length === 0 ? (
          <EmptyState
            isSearch={hasDocuments && hasFilters}
            onReset={resetFilters}
          />
        ) : (
          <div
            className={
              view === 'grid' ? styles.documentGrid : styles.documentList
            }
          >
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                view={view}
                onOpen={onOpenDocument}
              />
            ))}
          </div>
        )}
      </section>

      <div className={styles.notice}>
        <span />
        Sample entries only — no files have been imported or read from disk.
      </div>
    </div>
  )
}

export default Library