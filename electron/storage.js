
import { app, ipcMain } from 'electron'
import { Buffer } from 'node:buffer'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

const MAX_LIBRARY_SIZE = 10 * 1024 * 1024
let writeQueue = Promise.resolve()

function getLibraryPath() {
  return path.join(app.getPath('userData'), 'library.json')
}

function isValidDocument(document) {
  return (
    document &&
    typeof document === 'object' &&
    document.isImported === true &&
    typeof document.id === 'string' &&
    typeof document.title === 'string' &&
    typeof document.filePath === 'string' &&
    ['PDF', 'EPUB', 'DOCX'].includes(document.format)
  )
}

export async function readStoredLibrary() {
  try {
    const filePath = getLibraryPath()
    const contents = await readFile(filePath, 'utf8')

    if (Buffer.byteLength(contents, 'utf8') > MAX_LIBRARY_SIZE) {
      throw new Error('The saved library exceeds the allowed size.')
    }

    const parsed = JSON.parse(contents)

    if (!Array.isArray(parsed)) {
      throw new Error('The saved library file has an invalid format.')
    }

    return parsed.filter(isValidDocument)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

export async function isDocumentInStoredLibrary(filePath) {
  if (typeof filePath !== 'string' || !filePath) {
    return false
  }

  const library = await readStoredLibrary()
  const requestedPath = path.resolve(filePath)

  return library.some(
    (document) => path.resolve(document.filePath) === requestedPath,
  )
}

async function writeStoredLibrary(library) {
  if (!Array.isArray(library) || !library.every(isValidDocument)) {
    throw new Error('The library contains invalid document entries.')
  }

  const contents = JSON.stringify(library, null, 2)

  if (Buffer.byteLength(contents, 'utf8') > MAX_LIBRARY_SIZE) {
    throw new Error('The library is too large to save.')
  }

  const filePath = getLibraryPath()
  const directory = path.dirname(filePath)
  const temporaryPath = `${filePath}.tmp`

  await mkdir(directory, { recursive: true })
  await writeFile(temporaryPath, contents, 'utf8')
  await rename(temporaryPath, filePath)
}

export function registerStorageHandlers() {
  ipcMain.handle('library:load', async (event) => {
    if (event.senderFrame !== event.sender.mainFrame) {
      throw new Error('Untrusted library request.')
    }

    return readStoredLibrary()
  })

  ipcMain.handle('library:save', async (event, library) => {
    if (event.senderFrame !== event.sender.mainFrame) {
      throw new Error('Untrusted library request.')
    }

    const operation = writeQueue.then(() => writeStoredLibrary(library))
    writeQueue = operation.catch(() => {})
    await operation

    return { success: true }
  })
}
