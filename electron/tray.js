const { Tray, Menu, shell } = require('electron');
const path = require('path');
const { trayClick } = require('./window');

function initTray() {
  const trayMenu = new Tray(path.join(__dirname, '../public/antv_16x16.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '监听器',
      submenu: [
        { type: 'separator' },
        {
          label: '哔哩哔哩',
          click: () => {
            trayClick('bilibili', {
              width: 980,
              height: 1270,
              resizable: true,
              fullscreenable: false,
              title: 'Bilibili',
            });
          },
        },
        {
          label: '掘金',
          click: () => {
            trayClick('juejin', {
              width: 980,
              height: 1270,
              resizable: true,
              fullscreenable: false,
              title: '掘金',
            });
          },
        },
      ],
    },
    { type: 'separator' },
    {
      label: '偏好设置',
      click: () =>
        trayClick('setting/bilibili', {
          width: 800,
          height: 700,
          resizable: false,
          fullscreenable: false,
          title: '偏好设置',
        }),
    },
    { type: 'separator' },
    // {
    //   label: '更多',
    //   submenu: [{}],
    // },
    {
      label: '作者',
      submenu: [
        {
          label: 'B站',
          click: () => shell.openExternal('https://space.bilibili.com/29191310'),
        },
        {
          label: '掘金',
          click: () => shell.openExternal('https://juejin.cn/user/2700056290417133'),
        },
        {
          label: '知乎',
          click: () => shell.openExternal('https://www.zhihu.com/people/Eve.AngularJS'),
        },
      ],
    },
  ]);
  trayMenu.setToolTip('Platform Listener');
  trayMenu.setContextMenu(contextMenu);
}

exports.initTray = initTray;
