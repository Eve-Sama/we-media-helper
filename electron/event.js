const { session, ipcMain } = require('electron');

const Store = require('electron-store');
const store = new Store();

function initEvent() {
  ipcMain.on('bilibili-set-cookie', () => {
    const { cookie } = store.get('bilibili-config') || {};
    if (cookie) {
      const filter = {
        urls: [],
      };
      session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        if (details.url.startsWith('https://member.bilibili.com')) {
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
