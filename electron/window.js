const { BrowserWindow, Notification } = require('electron');
var _ = require('lodash');

const windowList = [];

function createWindow(path, title) {
  const browserWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  browserWindow.loadURL(`http://localhost:3000/${path}`);
  browserWindow.webContents.on('did-finish-load', () => browserWindow.setTitle(title));
  windowList.push(browserWindow);
  browserWindow.addListener('closed', () => _.remove(windowList, v => v === path));
}

function trayClick(path, title) {
  const index = windowList.findIndex(v => v === path);
  if (index === -1) {
    createWindow(path, title);
    windowList.push(path);
  } else {
    new Notification({ title: 'Platform Listener', body: '已存在该监视器!' }).show();
  }
}

exports.trayClick = trayClick;
