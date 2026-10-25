
import { useEffect, useState } from 'react'
import DocumentCard from '../../components/documents/DocumentCard.jsx'
import { loadLibrary, saveLibrary } from '../../services/libraryService.js'
import { selectDocuments } from '../../services/fileService.js'
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

function EmptyState({ isSearch, onReset, onAdd }) {
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
          : 'Add a PDF, EPUB, or DOCX from your system to see it here.'}
      </p>

      <button
        type="button"
        onClick={isSearch ? onReset : onAdd}
      >
        {isSearch ? 'Clear search and filters' : 'Add documents'}
      </button>
    </div>
  )
}

function Library({ onOpenDocument }) {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPickingFiles, setIsPickingFiles] = useState(false)
  const [fileError, setFileError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [view, setView] = useState('grid')

  useEffect(() => {
    let cancelled = false

    async function restoreLibrary() {
      try {
        const savedDocuments = await loadLibrary()

        // Only display genuine documents previously imported by the user.
        const importedDocuments = savedDocuments.filter(
          (document) =>
            document?.isImported === true &&
            typeof document.filePath === 'string' &&
            ['PDF', 'EPUB', 'DOCX'].includes(document.format),
        )

        if (!cancelled) {
          setDocuments(importedDocuments)
        }
      } catch (error) {
        console.error('Unable to load the saved library:', error)

        if (!cancelled) {
          setFileError(
            error instanceof Error
              ? `Could not load your saved library: ${error.message}`
              : 'Could not load your saved library.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    restoreLibrary()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleAddDocuments() {
    if (isPickingFiles || isLoading) return

    setIsPickingFiles(true)
    setFileError('')

    try {
      const result = await selectDocuments()

      if (result.canceled || result.files.length === 0) return

      const existingPaths = new Set(
        documents.map((document) => document.filePath),
      )

      const newDocuments = result.files
        .filter((file) => {
          if (existingPaths.has(file.filePath)) return false

          existingPaths.add(file.filePath)
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

      if (newDocuments.length === 0) return

      const nextDocuments = [...newDocuments, ...documents]

      // Save first, so navigating away immediately cannot lose the import.
      await saveLibrary(nextDocuments)
      setDocuments(nextDocuments)
    } catch (error) {
      console.error('Unable to add documents:', error)

      setFileError(
        error instanceof Error
          ? error.message
          : 'Could not add documents. Please try again.',
      )
    } finally {
      setIsPickingFiles(false)
    }
  }

  async function handleRemoveDocument(documentId) {
    setFileError('')

    const nextDocuments = documents.filter(
      (document) => document.id !== documentId,
    )

    try {
      await saveLibrary(nextDocuments)
      setDocuments(nextDocuments)
    } catch (error) {
      console.error('Unable to update the saved library:', error)

      setFileError(
        error instanceof Error
          ? error.message
          : 'Could not update the saved library.',
      )
    }
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
          <span>{isLoading ? '—' : documents.length}</span>
          <span>Total documents</span>
        </div>
      </section>

      <section className={styles.documentsSection}>
        <div className={styles.sectionHeading}>
          <div>
            <h3>Your documents</h3>
            <p>
              {isLoading
                ? 'Loading your library…'
                : `${filteredDocuments.length} of ${documents.length} documents`}
            </p>
          </div>

          <button
            type="button"
            className={styles.addDocumentsButton}
            onClick={handleAddDocuments}
            disabled={isPickingFiles || isLoading}
          >
            <span className={styles.addButtonIcon} aria-hidden="true">+</span>
            {isPickingFiles
              ? 'Opening picker…'
              : isLoading
                ? 'Loading…'
                : 'Add Documents'}
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

        {fileError && (
          <p className={styles.fileError} role="alert">
            {fileError}
          </p>
        )}

        {isLoading ? (
          <div className={styles.emptyState} role="status">
            <p>Loading your saved documents…</p>
          </div>
        ) : !hasDocuments || filteredDocuments.length === 0 ? (
          <EmptyState
            isSearch={hasDocuments && hasFilters}
            onReset={resetFilters}
            onAdd={handleAddDocuments}
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
        {isLoading
          ? 'Loading your locally saved library.'
          : 'Your library is saved on this device. Removing a document here does not delete the original file.'}
      </div>
    </div>
  )
}

export default Library
