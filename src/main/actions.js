import { app, ipcMain, shell } from 'electron';

export default function initActions() {
  ipcMain.handle('exit_app', () => app.exit());
  ipcMain.handle('open_external', (_, url) => shell.openExternal(url));
}
