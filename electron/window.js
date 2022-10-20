const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const windowMap = new Map();

function createWindow(routePath, windowOptions = {}) {
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
  browserWindow.loadURL(
    url.format({
      pathname: 'localhost:3000',
      protocol: 'http:',
      slashes: true,
      hash: `/${routePath}`,
    }),
  );
  // browserWindow.webContents.openDevTools();
  browserWindow.addListener('closed', () => windowMap.delete(routePath));
  windowMap.set(routePath, browserWindow);
}

function trayClick(path, windowOptions) {
  const window = windowMap.get(path);
  if (window) {
    window.show();
  } else {
    createWindow(path, windowOptions);
  }
}

exports.trayClick = trayClick;
exports.windowMap = windowMap;
