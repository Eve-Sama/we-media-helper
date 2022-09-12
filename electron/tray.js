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
            trayClick('bilibili', 'Bilibili - 前夕Sama', {
              width: 980,
              height: 270,
              openDevTools: false,
              resizable: false,
              fullscreenable: false,
              alwaysOnTop: true,
            });
          },
        },
        {
          label: '掘金',
          click: () => {
            trayClick('juejin', '掘金');
          },
        },
      ],
    },
    { type: 'separator' },
    {
      label: '偏好设置',
      click: () =>
        trayClick('setting', '偏好设置', {
          width: 576,
          height: 600,
          openDevTools: true,
          resizable: false,
          fullscreenable: false,
          alwaysOnTop: true,
        }),
    },
    { type: 'separator' },
    {
      label: '更多',
      submenu: [
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
          ],
        },
        {
          label: '关于软件',
          click: () => {
            trayClick('about', '关于软件');
          },
        },
      ],
    },
  ]);
  trayMenu.setToolTip('Platform Listener');
  trayMenu.setContextMenu(contextMenu);
}

exports.initTray = initTray;
