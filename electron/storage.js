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
        enableJumpLink: true,
        groupList: [
          {
            label: '基础数据',
            cardList: [
              {
                type: 'fan',
                notify: false,
              },
              {
                type: 'click',
                notify: false,
              },
              {
                type: 'totalReply',
                notify: false,
              },
              {
                type: 'dm',
                notify: false,
              },
              {
                type: 'totalLike',
                notify: false,
              },
              {
                type: 'share',
                notify: false,
              },
              {
                type: 'favorite',
                notify: false,
              },
              {
                type: 'coin',
                notify: false,
              },
            ],
            uuid: uuidv4(),
            columnNum: 4,
          },
          {
            label: '消息通知',
            cardList: [
              {
                type: 'reply',
                notify: true,
              },
              {
                type: 'at',
                notify: true,
              },
              {
                type: 'systemMessage',
                notify: true,
              },
              {
                type: 'message',
                notify: true,
              },
            ],
            uuid: uuidv4(),
            columnNum: 4,
          },
        ],
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
        enableJumpLink: true,
        groupList: [
          {
            label: '基础数据',
            cardList: [
              {
                type: 'likeTotal',
                notify: false,
              },
              {
                type: 'read',
                notify: false,
              },
              {
                type: 'power',
                notify: false,
              },
              {
                type: 'fan',
                notify: false,
              },
            ],
            uuid: uuidv4(),
            columnNum: 4,
          },
          {
            label: '消息通知',
            cardList: [
              {
                type: 'reply',
                notify: true,
              },
              {
                type: 'system',
                notify: true,
              },
            ],
            uuid: uuidv4(),
            columnNum: 2,
          },
        ],
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
