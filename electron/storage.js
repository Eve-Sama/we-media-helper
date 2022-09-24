const Store = require('electron-store');
const store = new Store();

function _initBilibiliSetting() {
  const key = 'bilibili-data';
  let storage = store.get(key);
  if (!storage) {
    storage = {
      config: {
        cookie: '',
        displayType: ['fan', 'click', 'reply', 'system', 'totalReply', 'dm', 'totalLike', 'share', 'favorite', 'coin', 'reply', 'at', 'systemMessage', 'message'],
        refreshTime: '00:00:30',
        showCountdown: true,
        notify: true,
      },
      dataCardList: [],
    };
  }
  store.set(key, storage);
}

function _initJueJinSetting() {
  const key = 'juejin-data';
  let storage = store.get(key);
  if (!storage) {
    storage = {
      config: {
        cookie: '',
        displayType: ['reply', 'system'],
        refreshTime: '00:00:30',
        showCountdown: true,
      },
      dataCardList: [],
    };
  }
  store.set(key, storage);
}

function initSetting() {
  // const key = 'bilibili-data';
  // const data = store.get(key);
  // data.dataCardList = [];
  // store.set(key, null);
  _initBilibiliSetting();
  _initJueJinSetting();
}

exports.initSetting = initSetting;
