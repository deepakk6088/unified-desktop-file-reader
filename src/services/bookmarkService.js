
import { loadLibrary, saveLibrary } from './libraryService.js'

export async function loadBookmarks(documentId) {
  const library = await loadLibrary()
  const document = library.find((item) => item.id === documentId)

  return Array.isArray(document?.bookmarks) ? document.bookmarks : []
}

export async function addBookmark(documentId, location) {
  const library = await loadLibrary()
  let updatedBookmarks = []

  const updatedLibrary = library.map((item) => {
    if (item.id !== documentId) return item

    const bookmarks = Array.isArray(item.bookmarks) ? item.bookmarks : []

    if (bookmarks.some((bookmark) => bookmark.key === location.key)) {
      updatedBookmarks = bookmarks
      return item
    }

    updatedBookmarks = [
      ...bookmarks,
      {
        id: crypto.randomUUID(),
        key: location.key,
        label: location.label,
        position: location.position,
        createdAt: new Date().toISOString(),
      },
    ]

    return { ...item, bookmarks: updatedBookmarks }
  })

  await saveLibrary(updatedLibrary)
  return updatedBookmarks
}

export async function removeBookmark(documentId, bookmarkId) {
  const library = await loadLibrary()
  let updatedBookmarks = []

  const updatedLibrary = library.map((item) => {
    if (item.id !== documentId) return item

    updatedBookmarks = (Array.isArray(item.bookmarks) ? item.bookmarks : [])
      .filter((bookmark) => bookmark.id !== bookmarkId)

    return { ...item, bookmarks: updatedBookmarks }
  })

  await saveLibrary(updatedLibrary)
  return updatedBookmarks
}
