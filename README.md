## platform-listener
(研发中)间隔特定时间抓取B站、掘金等多平台数据.

## roadmap
 - [x] 自定义卡片通知.
 - [x] 自定义列数.
 - [x] 设置恢复默认配置.
 - [x] 修复设置页面刷新重定向问题.
 - [ ] 将 Electron 改版为 TypeScript 版本(试过2次了, 老是会出问题).
 - [ ] 分组排序.
 - [ ] 卡片排序.
 - [ ] 制作欢迎页
 - [ ] 为各个窗口设置合适的尺寸大小.

## 本地开发

```bash
npm run start
```

目前本地开发都是正常的, 一键启动.
## 打包流程(存在问题, 简单记录下, 方便后期尝试)

执行`npm run build:web`, 会生成一个`build`目录, 拷贝`package.json`与`electron`文件夹至`build`中. 修改图标路径
```js
// tray.js
const trayMenu = new Tray(path.join(__dirname, '../antv_16x16.png'));
```
修改窗口载入链接(一直卡在这, 详见后文)
```js
// window.js
browserWindow.loadURL(xxx)
```
之后再执行
```bash
npx electron-packager . --overwrite
npx electron-installer-dmg ./platform-listener-darwin-arm64/platform-listener.app platform-listener --overwrite
```

### 打包 Mac DMG 遇到的问题

 - cannot find module 'electron-store' require stack
 - browserWindow.loadURL 的地址怎么写都无法正常访问页面