import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('desktop', {
  platform: process.platform,
  selectDocuments: () => ipcRenderer.invoke('documents:select'),
})
