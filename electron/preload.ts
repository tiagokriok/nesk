import { contextBridge } from 'electron';
import * as ipcs from './ipcs';
import { domReady, useLoading } from './loading';

declare global {
  interface Window {
    nesk: typeof API;
  }
}

export const API = {
  ...ipcs,
};

contextBridge.exposeInMainWorld('nesk', API);

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (event) => {
  event.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);
