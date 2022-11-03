const { BrowserWindow, app } = require('electron');

const path = require('path');
const url = require('url');

const { getSystemConfig, getTabConfig, setTabConfig } = require('./storage');

const windowMap = new Map();
const displayPathList = ['bilibili', 'juejin', 'zhihu'];

function createWindow(routePath, windowOptions = {}) {
  const browserWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    ...windowOptions,
  });
  if (app.isPackaged) {
    browserWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, `/../index.html`),
        protocol: 'file:',
        slashes: true,
        hash: `/${routePath}`,
      }),
    );
  } else {
    browserWindow.loadURL(
      url.format({
        pathname: 'localhost:3000',
        protocol: 'http:',
        slashes: true,
        hash: `/${routePath}`,
      }),
    );
  }

  const config = getSystemConfig();
  if (config.enableDebugMode) {
    browserWindow.webContents.openDevTools();
  }
  browserWindow.addListener('closed', () => {
    windowMap.delete(routePath);
    if (routePath === 'tab') {
      setTabConfig([]);
    }
  });
  windowMap.set(routePath, browserWindow);
  return browserWindow;
}

function trayClick(routePath, windowOptions) {
  const systemConfig = getSystemConfig();
  if (systemConfig.enableSingleMode && displayPathList.some(displayPath => displayPath === routePath)) {
    const existTabWindow = windowMap.get('tab');
    const tabConfig = getTabConfig();
    const tabIndex = tabConfig.findIndex(item => item === routePath);
    if (tabIndex === -1) {
      tabConfig.push(routePath);
    } else {
      tabConfig.splice(tabIndex, 1);
    }
    // 是否所有展示页面的 path 都被移除了
    const displayPathAllRemoved = !tabConfig.some(tabPath => displayPathList.some(displayPath => displayPath === tabPath));
    if (displayPathAllRemoved) {
      // 如果最后个数据展示tab也被删除了, 则直接关闭 Tab 窗口
      displayPathList.forEach(displayPath => {
        const browserWindow = windowMap.get(displayPath);
        if (browserWindow) {
          browserWindow.close();
        }
      });
      return;
    } else {
      // 激活 Tab 窗口
      const browserWindow = windowMap.get('tab');
      if (browserWindow) {
        browserWindow.show();
      }
    }
    setTabConfig(tabConfig);
    // 说明开启了 tab 页面
    if (existTabWindow) {
      existTabWindow.webContents.send('add-tab', routePath);
    } else {
      const browserWindow = createWindow('tab', {
        width: 980,
        height: 1270,
        resizable: true,
        fullscreenable: true,
        title: 'Platform Listener',
      });
      browserWindow.webContents.on('did-finish-load', () => browserWindow.webContents.send('add-tab', routePath));
    }
  } else {
    const window = windowMap.get(routePath);
    if (window) {
      window.show();
    } else {
      createWindow(routePath, windowOptions);
    }
  }
}

exports.trayClick = trayClick;
exports.windowMap = windowMap;
exports.displayPathList = displayPathList;
