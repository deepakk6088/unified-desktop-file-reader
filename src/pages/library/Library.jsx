
import { useState } from 'react'
import sampleDocuments from '../../data/sampleDocuments.js'
import DocumentCard from '../../components/documents/DocumentCard.jsx'
import styles from './Library.module.css'
import { selectDocuments } from '../../services/fileService.js'

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
          : 'Your documents will appear here when you add them.'}
      </p>

      <button type="button" onClick={onReset}>
        {isSearch ? 'Clear search and filters' : 'Reset library view'}
      </button>
    </div>
  )
}

function Library({ onOpenDocument }) {
  const [documents, setDocuments] = useState(sampleDocuments)
  const [isPickingFiles, setIsPickingFiles] = useState(false)
  const [fileError, setFileError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [view, setView] = useState('grid')

  async function handleAddDocuments() {
    if (isPickingFiles) return

    setIsPickingFiles(true)
    setFileError('')

    try {
      const result = await selectDocuments()

      // Closing the native dialog without selecting files changes nothing.
      if (result.canceled || result.files.length === 0) return

      setDocuments((currentDocuments) => {
        const existingPaths = new Set(
          currentDocuments
            .filter((document) => document.filePath)
            .map((document) => document.filePath),
        )

        const newPaths = new Set(existingPaths)

        const newDocuments = result.files
          .filter((file) => {
            if (newPaths.has(file.filePath)) return false

            // Also prevent duplicates within the same selection.
            newPaths.add(file.filePath)
            return true
          })
          .map((file) => ({
            id: `import-${crypto.randomUUID()}`,
            title: file.title,
            author: 'Imported document',
            format: file.format,
            category: 'Imported',
            updatedAt: 'Added just now',
            progress: 0,
            color:
              file.format === 'PDF'
                ? 'violet'
                : file.format === 'EPUB'
                  ? 'green'
                  : 'blue',
            filePath: file.filePath,
            fileName: file.fileName,
            isImported: true,
          }))

        return [...newDocuments, ...currentDocuments]
      })
    } catch (error) {
      console.error('Unable to add documents:', error)
      setFileError('Could not open the file picker. Please try again.')
    } finally {
      setIsPickingFiles(false)
    }
  }

  function handleRemoveDocument(documentId) {
    setDocuments((currentDocuments) =>
      currentDocuments.filter(
        (document) => document.id !== documentId,
      ),
    )
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredDocuments = documents.filter((document) => {
    const matchesSearch = [
      document.title,
      document.author,
      document.category,
      document.format,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)

    const matchesFormat =
      activeFilter === 'All' || document.format === activeFilter

    return matchesSearch && matchesFormat
  })

  const hasDocuments = documents.length > 0
  const hasFilters =
    normalizedQuery !== '' || activeFilter !== 'All'

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
          <span>{documents.length}</span>
          <span>Total documents</span>
        </div>
      </section>

      <section className={styles.documentsSection}>
        <div className={styles.sectionHeading}>
          <div>
            <h3>Your documents</h3>
            <p>
              {filteredDocuments.length} of {documents.length} documents
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddDocuments}
            disabled={isPickingFiles}
          >
            {isPickingFiles ? 'Opening…' : 'Add Documents'}
          </button>
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
            <div
              className={styles.filters}
              aria-label="Filter by format"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={
                    activeFilter === filter
                      ? styles.filterActive
                      : ''
                  }
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div
              className={styles.viewSwitch}
              aria-label="Document layout"
            >
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

        {fileError && <p role="alert">{fileError}</p>}

        {!hasDocuments || filteredDocuments.length === 0 ? (
          <EmptyState
            isSearch={hasDocuments && hasFilters}
            onReset={resetFilters}
          />
        ) : (
          <div
            className={
              view === 'grid'
                ? styles.documentGrid
                : styles.documentList
            }
          >
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                view={view}
                onOpen={onOpenDocument}
                onRemove={handleRemoveDocument}
              />
            ))}
          </div>
        )}
      </section>

      <div className={styles.notice}>
        <span />
        {documents.some((document) => document.isImported)
          ? 'Your library contains sample entries and imported documents.'
          : 'Sample entries only — add documents to your library.'}
      </div>
    </div>
  )
}

export default Library
