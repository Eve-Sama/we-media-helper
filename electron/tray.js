const { Tray, Menu, shell, app } = require('electron');

const path = require('path');

const { trayClick } = require('./window');

function initTray() {
  const menuIcon = app.isPackaged ? `../menu-icon-prod.png` : `../scripts/assets/icons/menu-icon-dev.png`;
  const trayMenu = new Tray(path.join(__dirname, menuIcon));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '监听器列表',
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
        {
          label: '知乎',
          click: () => {
            trayClick('zhihu', {
              width: 980,
              height: 1270,
              resizable: true,
              fullscreenable: false,
              title: '知乎',
            });
          },
        },
      ],
    },
    {
      label: '监听器设置',
      click: () =>
        trayClick('setting/bilibili', {
          width: 850,
          height: 700,
          resizable: false,
          fullscreenable: false,
          title: '监听器设置',
        }),
    },
    { type: 'separator' },
    {
      label: '系统',
      submenu: [
        {
          label: '调试模式',
          type: 'checkbox',
          checked: false,
          click: e => {
            if (e.checked) {
              console.log('开启调试模式');
            } else {
              console.log('关闭调试模式');
            }
          },
        },
        // {
        //   label: '清除配置',
        //   click: () => {
        //     console.log('清除配置');
        //   },
        // },
        {
          label: '退出',
          role: 'quit',
        },
      ],
    },
    { type: 'separator' },
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
