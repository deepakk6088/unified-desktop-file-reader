
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { ipcMain, dialog, BrowserWindow } from 'electron'

const allowedExtensions = new Set(['.pdf', '.epub', '.docx'])
const MAX_DOCUMENT_SIZE = 100 * 1024 * 1024

const formatNames = {
  '.pdf': 'PDF',
  '.epub': 'EPUB',
  '.docx': 'DOCX',
}

const selectedFiles = new Map()

function isTrustedMainFrame(event) {
  return event.senderFrame === event.sender.mainFrame
}

async function readSelectedFile(filePath, allowedExtension) {
  if (typeof filePath !== 'string' || !filePath) {
    throw new Error('No document was specified.')
  }

  const extension = path.extname(filePath).toLowerCase()

  if (!allowedExtension.has(extension)) {
    throw new Error('This document format is not supported.')
  }

  if (![...selectedFiles.values()].includes(filePath)) {
    throw new Error(
      'This file was not selected through the document picker. Add it to your library again.',
    )
  }

  const fileInfo = await stat(filePath)

  if (!fileInfo.isFile()) {
    throw new Error('The selected document is not a regular file.')
  }

  if (fileInfo.size > MAX_DOCUMENT_SIZE) {
    throw new Error('This document is larger than the 100 MB limit.')
  }

  return new Uint8Array(await readFile(filePath))
}

export function registerFileHandlers() {
  ipcMain.handle('documents:select', async (event) => {
    if (!isTrustedMainFrame(event)) {
      throw new Error('Untrusted request.')
    }

    const parentWindow = BrowserWindow.fromWebContents(event.sender)

    const options = {
      title: 'Add Documents',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'Supported Documents',
          extensions: ['pdf', 'epub', 'docx'],
        },
      ],
    }

    const result = parentWindow
      ? await dialog.showOpenDialog(parentWindow, options)
      : await dialog.showOpenDialog(options)

    if (result.canceled) {
      return { canceled: true, files: [] }
    }

    const files = result.filePaths
      .filter((filePath) =>
        allowedExtensions.has(path.extname(filePath).toLowerCase()),
      )
      .map((filePath) => {
        const extension = path.extname(filePath).toLowerCase()

        let fileId = [...selectedFiles.entries()].find(
          ([, selectedPath]) => selectedPath === filePath,
        )?.[0]

        if (!fileId) {
          fileId = randomUUID()
          selectedFiles.set(fileId, filePath)
        }

        return {
          fileId,
          filePath,
          fileName: path.basename(filePath),
          title: path.basename(filePath, extension),
          format: formatNames[extension],
        }
      })

    return { canceled: false, files }
  })

  ipcMain.handle('documents:read-pdf', async (event, filePath) => {
    if (!isTrustedMainFrame(event)) {
      throw new Error('Untrusted request.')
    }

    return readSelectedFile(filePath, new Set(['.pdf']))
  })

  ipcMain.handle('documents:read-file', async (event, filePath) => {
    if (!isTrustedMainFrame(event)) {
      throw new Error('Untrusted request.')
    }

    return readSelectedFile(filePath, new Set(['.epub', '.docx']))
  })
}
