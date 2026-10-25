import path from 'node:path'
import { ipcMain, dialog, BrowserWindow } from 'electron'

const allowedExtensions = new Set(['.pdf', '.epub', '.docx'])

const formatNames = {
  '.pdf': 'PDF',
  '.epub': 'EPUB',
  '.docx': 'DOCX',
}

export function registerFileHandlers() {
  ipcMain.handle('documents:select', async (event) => {
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

        return {
          filePath,
          fileName: path.basename(filePath),
          title: path.basename(filePath, extension),
          format: formatNames[extension],
        }
      })

    return { canceled: false, files }
  })
}
