const { BrowserWindow, Notification } = require('electron');
const ElectronStore = require('electron-store');
ElectronStore.initRenderer();
const path = require('path');
const _ = require('lodash');

const windowList = [];

function createWindow(routePath, title, windowOptions = {}) {
  const browserWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    ...windowOptions,
  });
  browserWindow.loadURL(`http://localhost:3000/${routePath}`);
  browserWindow.webContents.on('did-finish-load', () => browserWindow.setTitle(title));
  if (windowOptions.openDevTools) {
    browserWindow.webContents.openDevTools();
  }
  browserWindow.addListener('closed', () => _.remove(windowList, v => v === routePath));
  windowList.push(browserWindow);
}

function trayClick(path, title, windowOptions) {
  const index = windowList.findIndex(v => v === path);
  if (index === -1) {
    createWindow(path, title, windowOptions);
    windowList.push(path);
  } else {
    new Notification({ title: 'Platform Listener', body: '已存在该监听器!' }).show();
  }
}

exports.trayClick = trayClick;
