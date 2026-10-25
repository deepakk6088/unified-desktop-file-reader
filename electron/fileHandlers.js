
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { ipcMain, dialog, BrowserWindow } from 'electron'

const allowedExtensions = new Set(['.pdf', '.epub', '.docx'])
const MAX_PDF_SIZE = 100 * 1024 * 1024

const formatNames = {
  '.pdf': 'PDF',
  '.epub': 'EPUB',
  '.docx': 'DOCX',
}

// Only files selected through this native picker may be read.
const selectedFiles = new Map()

function isTrustedMainFrame(event) {
  return event.senderFrame === event.sender.mainFrame
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

    if (typeof filePath !== 'string' || !filePath) {
      throw new Error('No PDF was specified.')
    }

    const extension = path.extname(filePath).toLowerCase()

    if (extension !== '.pdf') {
      throw new Error('Only PDF documents can be opened in the reader.')
    }

    const isSelected = [...selectedFiles.values()].includes(filePath)

    if (!isSelected) {
      throw new Error(
        'This file was not selected through the document picker. Add it to your library again.',
      )
    }

    const fileInfo = await stat(filePath)

    if (!fileInfo.isFile()) {
      throw new Error('The selected document is not a regular file.')
    }

    if (fileInfo.size > MAX_PDF_SIZE) {
      throw new Error('This PDF is larger than the 100 MB limit.')
    }

    const buffer = await readFile(filePath)

    return new Uint8Array(buffer)
  })
}
