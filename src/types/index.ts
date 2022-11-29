export interface API {
  close(): void;
  deliver(channel: string, data: any): void;
  receive(channel: string, callback: Function): void;
  redirect(url: string): void;
  settings(arg: boolean): void;
}

declare global {
  interface Window {
    nesk: API;
  }
}
