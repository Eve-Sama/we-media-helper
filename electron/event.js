const { session, ipcMain, Notification, shell } = require('electron');
const Store = require('electron-store');

const { windowMap } = require('./window');

const store = new Store();

function setCookie() {
  const updateCookie = (key, details) => {
    if (details.url.indexOf(key) !== -1) {
      const data = store.get(`${key}-data`);
      if (data) {
        details.requestHeaders['Referer'] = null;
        details.requestHeaders['cookie'] = data.config.cookie;
      }
    }
  };
  const filter = {
    urls: [],
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    updateCookie('juejin', details);
    updateCookie('bilibili', details);
    updateCookie('zhihu', details);
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
}

function initEvent() {
  setCookie();

  ipcMain.on('set-title', (_, message) => {
    const { key, title } = message;
    const browserWindow = windowMap.get(key);
    // 如果是 tab 页面, 则不设置标题了
    browserWindow?.setTitle(title);
  });

  ipcMain.on('notify', (_, message) => {
    const { title, url } = message;
    const notification = new Notification({ title, body: '数据发生变动' });
    notification.on('click', () => shell.openExternal(url));
    notification.show();
  });

  ipcMain.on('openURL', (_, message) => {
    const { url } = message;
    shell.openExternal(url);
  });
}

exports.initEvent = initEvent;
