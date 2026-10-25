
import { useEffect, useState } from 'react'
import {
  addBookmark,
  loadBookmarks,
  removeBookmark,
} from '../../services/bookmarkService.js'
import styles from './BookmarkBar.module.css'

function BookmarkBar({ document, currentLocation, onJump }) {
  const [bookmarks, setBookmarks] = useState([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadBookmarks(document.id)
      .then((items) => {
        if (!cancelled) setBookmarks(items)
      })
      .catch((error) => {
        console.error('Could not load bookmarks:', error)
        if (!cancelled) setMessage('Could not load bookmarks.')
      })

    return () => {
      cancelled = true
    }
  }, [document.id])

  async function handleAdd() {
    if (!currentLocation || busy) return

    setBusy(true)
    setMessage('')

    try {
      const updated = await addBookmark(document.id, currentLocation)
      setBookmarks(updated)

      const alreadySaved = updated.filter(
        (item) => item.key === currentLocation.key,
      ).length > 0

      setMessage(
        alreadySaved
          ? 'Bookmark saved.'
          : 'This location is already bookmarked.',
      )
    } catch (error) {
      console.error('Could not save bookmark:', error)
      setMessage('Could not save bookmark.')
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove(bookmarkId) {
    if (busy) return

    setBusy(true)
    setMessage('')

    try {
      const updated = await removeBookmark(document.id, bookmarkId)
      setBookmarks(updated)
      setMessage('Bookmark removed.')
    } catch (error) {
      console.error('Could not remove bookmark:', error)
      setMessage('Could not remove bookmark.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={styles.bookmarks} aria-label="Document bookmarks">
      <div className={styles.header}>
        <div>
          <h3>Bookmarks</h3>
          <p>Save a place and return to it anytime.</p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!currentLocation || busy}
        >
          + Add bookmark
        </button>
      </div>

      {bookmarks.length === 0 ? (
        <p className={styles.empty}>No bookmarks yet.</p>
      ) : (
        <ul className={styles.list}>
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className={styles.item}>
              <button
                type="button"
                className={styles.jump}
                onClick={() => onJump(bookmark)}
                title={`Go to ${bookmark.label}`}
              >
                <span aria-hidden="true">🔖</span>
                <span>{bookmark.label}</span>
              </button>

              <button
                type="button"
                className={styles.remove}
                onClick={() => handleRemove(bookmark.id)}
                disabled={busy}
                aria-label={`Remove bookmark ${bookmark.label}`}
                title="Remove bookmark"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {message && (
        <p className={styles.message} role="status">
          {message}
        </p>
      )}
    </section>
  )
}

export default BookmarkBar
