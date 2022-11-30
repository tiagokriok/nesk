import { ipcRenderer } from 'electron';

export function settings(arg: boolean) {
  ipcRenderer.send('open-preferences', arg);
}
