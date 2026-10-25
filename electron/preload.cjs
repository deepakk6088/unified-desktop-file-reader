const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktop', {
  platform: process.platform,
  selectDocuments: () => ipcRenderer.invoke('documents:select'),
})
