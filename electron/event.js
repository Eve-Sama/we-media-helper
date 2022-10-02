const { session, ipcMain, Notification } = require('electron');
const { windowMap } = require('./window');

const Store = require('electron-store');
const store = new Store();

function setCookie() {
  const fn = (type, details) => {
    if (details.url.indexOf(type) !== -1) {
      const { cookie } = (store.get(`${type}-data`) || {}).config;
      details.requestHeaders['Referer'] = null;
      details.requestHeaders['cookie'] = cookie;
    }
  };
  const filter = {
    urls: [],
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    fn('juejin', details);
    fn('bilibili', details);
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
}

function initEvent() {
  setCookie();

  ipcMain.on('bilibili-set-title', (_, message) => {
    const browserWindow = windowMap.get('bilibili');
    browserWindow.setTitle(message);
  });

  ipcMain.on('juejin-set-title', (_, message) => {
    const browserWindow = windowMap.get('juejin');
    browserWindow.setTitle(message);
  });

  ipcMain.on('notify', (_, message) => {
    const { title } = message;
    new Notification({ title, body: '你收到了一条消息' }).show();
  });
}

exports.initEvent = initEvent;
