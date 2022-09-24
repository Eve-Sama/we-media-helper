const Store = require('electron-store');
const store = new Store();

function _initBilibiliSetting() {
  const key = 'bilibili-data';
  let data = store.get(key);
  if (!data) {
    data = {
      config: {
        cookie: null,
        displayType: ['reply', 'system', 'totalReply', 'dm', 'totalLike', 'share', 'favorite', 'coin', 'reply', 'at', 'systemMessage', 'message'],
        refreshTime: '00:00:30',
        showCountdown: true,
      },
    };
  }
  store.set(key, data);
}

function _initJueJinSetting() {
  const key = 'juejin-data';
  let data = store.get(key);
  if (!data) {
    data = {
      config: {
        cookie: '',
        displayType: ['reply', 'system'],
        refreshTime: '00:00:30',
        showCountdown: true,
      },
    };
  }
  store.set(key, data);
}

function initSetting() {
  // store.set('juejin-data', null);
  _initBilibiliSetting();
  _initJueJinSetting();
}

exports.initSetting = initSetting;
