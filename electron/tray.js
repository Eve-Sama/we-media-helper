const { Tray, Menu, BrowserWindow } = require('electron');
const path = require('path');

function createWindow(path) {
  const browserWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  browserWindow.loadURL(`http://localhost:3000/${path}`);
  browserWindow.webContents.openDevTools();
  // browserWindow.webContents.on('did-finish-load', () => {
  //   browserWindow.setTitle('xxx');
  // });
}

function initTray() {
  const trayMenu = new Tray(path.join(__dirname, '../public/antv_16x16.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '监听器',
      submenu: [
        {
          label: '全部开启',
          click: () => {
            console.log('全部开启');
          },
        },
        { type: 'separator' },
        {
          label: 'Bilibili',
          type: 'radio',
          click: () => {
            createWindow('bilibili');
          },
        },
        {
          label: '掘金',
          type: 'radio',
          click: () => {
            createWindow('juejin');
          },
        },
      ],
    },
  ]);
  trayMenu.setToolTip('Platform Listener');
  trayMenu.setContextMenu(contextMenu);
}

exports.initTray = initTray;
