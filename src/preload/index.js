import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const api = {
  exitApp: () => ipcRenderer.invoke('exit_app'),
  openExternal: (url) => ipcRenderer.invoke('open_external', url),
  auth: () => ipcRenderer.invoke('auth'),
  equip: (uuid, user) => ipcRenderer.invoke('equip', uuid, user),
  updateTier: (rank, user) => ipcRenderer.invoke('update_tier', rank, user),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
