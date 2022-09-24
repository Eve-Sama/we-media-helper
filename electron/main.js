const { app, BrowserWindow } = require('electron');
const { initTray } = require('./tray');
const { initEvent } = require('./event');
const { initSetting } = require('./storage');

app.on('ready', () => {
  initTray();
  initEvent();
  initSetting();
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
    // new Notification({ title: 'React YYDS', body: '重新创建咯' }).show();
  }
});
