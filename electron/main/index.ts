process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST_ELECTRON, '../public');

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { release } from 'os';
import { join } from 'path';
import { PLATFORM } from '../../shared/constants';
import { userPreferences } from '../../shared/store';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (PLATFORM.IS_WINDOWS) app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
const {
  store: {
    hasShadow,
    screen: { initial, large },
  },
} = userPreferences;

async function createWindow() {
  win = new BrowserWindow({
    title: 'Nesk',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    frame: false,
    center: true,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    maximizable: false,
    minimizable: false,
    fullscreen: false,
    titleBarStyle: 'customButtonsOnHover',
    width: initial.width,
    height: initial.height,
    maxWidth: initial.width,
    maxHeight: 473,
    hasShadow,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.setMenu(null);

  win.setAlwaysOnTop(true, 'screen-saver');

  win.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url);

    win.webContents.openDevTools({
      mode: 'detach',
    });
  } else {
    win.loadFile(indexHtml);
  }

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // win.on('move', () => {
  //   console.info('move');
  // });
}

PLATFORM.IS_MAC && win.setWindowButtonVisibility(false);

if (PLATFORM.IS_LINUX) {
  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('disable-gpu');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.on('open-preferences', (event, arg) => {
  const h = arg ? large.height : initial.height;
  win.setResizable(true);
  win.setSize(initial.width, h, true);
  win.setResizable(false);
});

ipcMain.on('redirect', (event, url) => {
  if (url.startsWith('https:')) shell.openExternal(url);
});

ipcMain.on('close', (event) => {
  app.quit();
});

// ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
//   try {
//     console.log(...args);
//     win.setIgnoreMouseEvents(...args);
//     // BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(...args);
//   } catch (e) {
//     console.error(e);
//   }
// });
