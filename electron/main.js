
import { app, BrowserWindow } from 'electron'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { registerFileHandlers } from './fileHandlers.js'

const currentDirectory = fileURLToPath(new URL('.', import.meta.url))

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Unified Desktop File Reader',
    webPreferences: {
      preload: join(currentDirectory, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  if (app.isPackaged) {
    mainWindow.loadFile(join(currentDirectory, '../dist/index.html'))
  } else {
    mainWindow.loadURL('http://127.0.0.1:5173')
  }
}

registerFileHandlers()

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
