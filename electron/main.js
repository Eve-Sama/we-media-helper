const { app, BrowserWindow, Notification } = require('electron');
const { initTray } = require('./tray');
const { initEvent } = require('./event');

// ipcMain.on('navigate', e => {
//   // console.log(e, e);
//   // createWindow();
//   app.quit();
// });

function createMainWindow() {
  const browserWindow = new BrowserWindow({
    // width: 1172,
    // height: 955,
    // width: 980,
    // height: 285,
    // minWidth: 980,
    // minHeight: 285,
    // maxHeight: 285,
    // opacity: 0.5,
    // backgroundColor: '#000',
  });
  // 加载应用----适用于 react 项目
  browserWindow.loadURL('http://localhost:3000/');

  // 打开开发者工具，默认不打开
  // browserWindow.webContents.openDevTools();
}

app.on('ready', () => {
  createMainWindow();
  initTray();
  initEvent();
});

// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
    new Notification({ title: 'React YYDS', body: '重新创建咯' }).show();
  }
});
