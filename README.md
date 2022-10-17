## 业务背景

![image-20221016203726186](https://camo.githubusercontent.com/e125cd98be129653e59f27d4cb54484c77d78926f229e586138b07349fe25306/68747470733a2f2f6576652d73616d612e6f73732d636e2d7368616e676861692e616c6979756e63732e636f6d2f626c6f672f3230323231303136323033373231342e706e67)

该软件只用于解决我自己的痛点. 因为我经常在B站、掘金发布一些技术相关的作品, 有些社区朋友会给我留言和我互动. 但是一直以来都没有特别好的渠道能够第一时间获取评论动态. 只能访问站点才能知道, 这非常的不方便. 因此写了个软件, 每隔一定时间自动抓取数据, 并且可以自定义很多内容, 直接看图吧.

<img src="https://camo.githubusercontent.com/6168af909991fbacf4a447f3e8f878f54144745468c7cc241f305e4c3e14dc55/68747470733a2f2f6576652d73616d612e6f73732d636e2d7368616e676861692e616c6979756e63732e636f6d2f626c6f672f3230323231303136323032393738362e706e67" alt="image-20221016202949743" style="zoom:50%;" />

<img src="https://camo.githubusercontent.com/ad31055d493a0c7c751c070014c5f135f70d4dee874248b4593ab0a50215887f/68747470733a2f2f6576652d73616d612e6f73732d636e2d7368616e676861692e616c6979756e63732e636f6d2f626c6f672f3230323231303136323033303830392e706e67" alt="image-20221016203003789" style="zoom:50%;" />

这是数据大屏界面, 目前只实现了掘金和B站, 其他的站点暂时没有精力实现. 我们可以在偏好设置中, 进行相关设置.

<img src="https://camo.githubusercontent.com/ada2d2a1296e16fd29bfd2df308196e7162ae0017ad8ee768f5734d8e28424ed/68747470733a2f2f6576652d73616d612e6f73732d636e2d7368616e676861692e616c6979756e63732e636f6d2f626c6f672f3230323231303136323033313236382e706e67" alt="image-20221016203140231" style="zoom:50%;" />

<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210171738800.png" alt="image-20221016203205201"/>

卡片中的绿点, 就是有新的数据更新时, 进行桌面通知.

<img src="https://camo.githubusercontent.com/470dde0da53018899c0005a4027c1e9044e9c59efb9089c456037f935f1a11ff/68747470733a2f2f6576652d73616d612e6f73732d636e2d7368616e676861692e616c6979756e63732e636f6d2f626c6f672f3230323231303136323033343534322e706e67" alt="image-20221016203446518" style="zoom:50%;" />

注意! 目前只能在本地开发模式使用, 未发布dmg or exe, 因为打包构建目前存在一点问题无法解决,详情可见: [Cannot find module 'electron-store' when packup DMG via electron](https://stackoverflow.com/questions/74086169/cannot-find-module-electron-store-when-packup-dmg-via-electron)

## roadmap

 - [x] 自定义卡片通知.
 - [x] 自定义列数.
 - [x] 设置恢复默认配置.
 - [x] 修复设置页面刷新重定向问题.
 - [ ] 将 Electron 改版为 TypeScript 版本(试过2次了, 老是会出问题).
 - [ ] 分组排序.
 - [ ] 卡片排序.
 - [ ] 制作欢迎页.
 - [ ] 为各个窗口设置合适的尺寸大小.
 - [ ] 自定义通知音效(QQ、微信、系统跟随、剑三等).
 - [ ] 区分开发与生产环境, 用于设置一些默认配置, 如console

## 本地开发

```bash
npm run start
```

目前本地开发都是正常的, 一键启动. 很舒服

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
cd build
npx electron-packager . --overwrite
npx electron-installer-dmg ./platform-listener-darwin-arm64/platform-listener.app platform-listener --overwrite
```

### 打包 Mac DMG 遇到的问题

 - cannot find module 'electron-store' require stack(前文的stack overflow链接)
 - browserWindow.loadURL 的地址怎么写都无法正常访问页面(也许用哈希路由可以解决, 尚未验证)