import { ipcRenderer } from 'electron';

export function deliver(channel: string, data: any) {
  ipcRenderer.send(channel, data);
}
