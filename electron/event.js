const { session, ipcMain, Notification } = require('electron');
const { windowMap } = require('./window');

const Store = require('electron-store');
const store = new Store();

function initEvent() {
  ipcMain.on('bilibili-set-title', (_, message) => {
    const browserWindow = windowMap.get('bilibili');
    browserWindow.setTitle(message);
  });

  ipcMain.on('juejin-set-title', (_, message) => {
    const browserWindow = windowMap.get('juejin');
    browserWindow.setTitle(message);
  });

  ipcMain.on('bilibili-set-cookie', () => {
    const { cookie } = (store.get('bilibili-data') || {}).config;
    if (cookie) {
      const filter = {
        urls: [],
      };
      session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        if (details.url.indexOf('bilibili') !== -1) {
          details.requestHeaders['Referer'] = null;
          details.requestHeaders['cookie'] = cookie;
        }
        callback({ cancel: false, requestHeaders: details.requestHeaders });
      });
    }
  });

  ipcMain.on('juejin-set-cookie', () => {
    const { cookie } = (store.get('juejin-data') || {}).config;
    if (cookie) {
      const filter = {
        urls: [],
      };
      session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        if (details.url.indexOf('juejin') !== -1) {
          details.requestHeaders['Referer'] = null;
          details.requestHeaders['cookie'] = cookie;
        }
        callback({ cancel: false, requestHeaders: details.requestHeaders });
      });
    }
  });

  ipcMain.on('notify', (_, message) => {
    const { title } = message;
    new Notification({ title, body: '你收到了一条消息' }).show();
  });
}

exports.initEvent = initEvent;
