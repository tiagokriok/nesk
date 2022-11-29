import { ipcRenderer } from 'electron';

export function redirect(url: string) {
  ipcRenderer.send('redirect', url);
}
