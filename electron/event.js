const { session, ipcMain } = require('electron');
const { windowMap } = require('./window');

const Store = require('electron-store');
const store = new Store();

function initEvent() {
  ipcMain.on('bilibili-set-title', (_, message) => {
    const browserWindow = windowMap.get('bilibili');
    browserWindow.setTitle(message);
  });

  ipcMain.on('bilibili-set-cookie', () => {
    const { cookie } = store.get('bilibili-config') || {};
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
    // console.log(message, `message`);
    // new Notification({ title: 'Notification', body: message }).show();
  });
}

exports.initEvent = initEvent;
