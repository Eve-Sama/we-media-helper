const { Tray, Menu, shell, app, screen } = require('electron');

const path = require('path');

const { getSystemConfig, setSystemConfig, getTabConfig, setTabConfig } = require('./storage');
const { trayClick, windowMap, displayPathList } = require('./window');

const keyNameMap = new Map([
  ['display/bilibili', '哔哩哔哩'],
  ['display/juejin', '掘金'],
  ['display/zhihu', '知乎'],
]);

function getDisplayByBrowserWindow(browserWindow) {
  const winBounds = browserWindow.getBounds();
  const whichScreen = screen.getDisplayNearestPoint({ x: winBounds.x, y: winBounds.y });
  return whichScreen;
}

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
            trayClick('display/bilibili', {
              width: 980,
              height: 1270,
              resizable: true,
              fullscreenable: true,
              title: keyNameMap.get('display/bilibili'),
            });
          },
        },
        {
          label: '掘金',
          click: () => {
            trayClick('display/juejin', {
              width: 980,
              height: 1270,
              resizable: true,
              fullscreenable: true,
              title: keyNameMap.get('display/juejin'),
            });
          },
        },
        {
          label: '知乎',
          click: () => {
            trayClick('display/zhihu', {
              width: 980,
              height: 1270,
              resizable: true,
              fullscreenable: true,
              title: keyNameMap.get('display/zhihu'),
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
          checked: getSystemConfig().enableDebugMode,
          click: e => {
            const config = getSystemConfig();
            config.enableDebugMode = e.checked;
            setSystemConfig(config);
            if (config.enableDebugMode) {
              windowMap.forEach(browserWindow => browserWindow.webContents.openDevTools());
            } else {
              windowMap.forEach(browserWindow => browserWindow.webContents.closeDevTools());
            }
          },
        },
        {
          label: '单屏模式',
          type: 'checkbox',
          checked: getSystemConfig().enableSingleMode,
          click: e => {
            // #region 将新的状态保存在本地
            const config = getSystemConfig();
            config.enableSingleMode = e.checked;
            setSystemConfig(config);
            // #endregion
            if (config.enableSingleMode) {
              // 关闭多个独立展示页面, 打开 tab 窗口
              const pathList = [];
              displayPathList.forEach(displayPath => {
                const openedPathList = Array.from(windowMap.keys());
                if (openedPathList.find(openedPath => openedPath === displayPath)) {
                  pathList.push(displayPath);
                }
                const browserWindow = windowMap.get(displayPath);
                if (browserWindow) {
                  browserWindow.close();
                }
              });
              setTabConfig(pathList);
              if (pathList.length > 0) {
                trayClick('display/tab', {
                  width: 980,
                  height: 1270,
                  resizable: true,
                  fullscreenable: true,
                  title: 'Platform Listener',
                });
              }
            } else {
              // 关闭 tab 窗口, 开启多个独立展示窗口
              const browserWindow = windowMap.get('display/tab');
              let workArea;
              if (browserWindow) {
                const display = getDisplayByBrowserWindow(browserWindow);
                workArea = display.workArea;
              } else {
                workArea = screen.getPrimaryDisplay().workArea;
              }
              const tabConfig = getTabConfig();
              if (browserWindow) {
                browserWindow.close();
              }
              tabConfig.forEach((key, index) => {
                // 平分窗口宽度
                const width = workArea.width / tabConfig.length;
                trayClick(key, {
                  width: width,
                  height: 1270,
                  x: index * width,
                  y: 0,
                  resizable: true,
                  fullscreenable: true,
                  title: keyNameMap.get(key),
                });
              });
            }
          },
        },
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
