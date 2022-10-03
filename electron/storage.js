const Store = require('electron-store');
const { v4: uuidv4 } = require('uuid');

const store = new Store();

/** @todo 这种默认配置应该写一份就可以的. 但是因为 electron TS化目前跑不起来, 先临时写2份吧 */
function _initBilibiliSetting() {
  const key = 'bilibili-data';
  let storage = store.get(key);
  if (!storage) {
    storage = {
      config: {
        cookie: '',
        refreshTime: '00:00:30',
        showCountdown: true,
        notify: true,
        groupList: [
          {
            label: '基础数据',
            cardList: ['fan', 'click', 'totalReply', 'dm', 'totalLike', 'share', 'favorite', 'coin'],
            uuid: uuidv4(),
          },
          {
            label: '消息通知',
            cardList: ['reply', 'at', 'systemMessage', 'message'],
            uuid: uuidv4(),
          },
        ],
        columnNum: 4,
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
        refreshTime: '00:00:30',
        showCountdown: true,
        notify: true,
        groupList: [
          {
            label: '消息通知',
            cardList: ['reply', 'system'],
            uuid: uuidv4(),
          },
        ],
        columnNum: 4,
      },
      dataCardList: [],
    };
  }
  store.set(key, storage);
}

function initSetting() {
  // const key = 'bilibili-data';
  // // const data = store.get(key);
  // // data.dataCardList = [];
  // store.set(key, null);
  _initBilibiliSetting();
  _initJueJinSetting();
}

exports.initSetting = initSetting;
