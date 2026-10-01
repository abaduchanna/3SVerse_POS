/* 3S Verse POS - preload bridge */
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('novapos', {
  isElectron: true,
  autoLocate: () => ipcRenderer.invoke('drive:autoLocate'),
  saveBackup: (folder, json) => ipcRenderer.invoke('backup:save', { folder, json }),
  readBackup: (folder) => ipcRenderer.invoke('backup:read', { folder }),
  openExternal: (url) => ipcRenderer.invoke('shell:open', url),
  waSend: (phone, caption, pngDataUrl) => ipcRenderer.invoke('wa:send', { phone, caption, pngDataUrl })
});
