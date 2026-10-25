
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktop', {
  platform: process.platform,

  selectDocuments: () =>
    ipcRenderer.invoke('documents:select'),

  readPdf: (filePath) =>
    ipcRenderer.invoke('documents:read-pdf', filePath),

  readDocument: (filePath) =>
    ipcRenderer.invoke('documents:read-file', filePath),

  loadLibrary: () =>
    ipcRenderer.invoke('library:load'),

  saveLibrary: (library) =>
    ipcRenderer.invoke('library:save', library),
})
