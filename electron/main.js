// 引入electron并创建一个Browserwindow
const { app, BrowserWindow } = require('electron');

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.

function createWindow() {
  //创建浏览器窗口,宽高自定义具体大小你开心就好
  const browserWindow = new BrowserWindow({ width: 800, height: 600 });
  // 加载应用----适用于 react 项目
  browserWindow.loadURL('http://localhost:3000/');

  // 打开开发者工具，默认不打开
  // browserWindow.webContents.openDevTools()
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', () => {
  createWindow;
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
    createWindow();
  }
});

// 你可以在这个脚本中续写或者使用require引入独立的js文件.
