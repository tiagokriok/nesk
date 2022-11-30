import { ipcRenderer } from 'electron';

export function receive(channel: string, callback: Function) {
  ipcRenderer.on(channel, (_, data) => callback(data));
}
