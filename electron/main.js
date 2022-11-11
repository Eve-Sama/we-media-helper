const { app } = require('electron');

const { initEvent } = require('./event');
const { initConfig, resetTabConfig } = require('./storage');
const { initTray } = require('./tray');

app.on('ready', () => {
  initConfig();
  initTray();
  initEvent();
  resetTabConfig();
});

// 如果不写这个, 会在关闭一个窗口时直接退出应用
app.on('window-all-closed', function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
