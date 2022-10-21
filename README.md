## 业务背景

像B站、掘金这类网站, 评论都是通过站内信进行通知的. 这会导致用户的留言, 往往要等到我打开站点的时候才能得到回复, 我无法实时得知最新的留言数据, 如果使用轮训则过于麻烦. 因此, 我开发了这款"Platform Listener", 顾名思义, 主要是用于监听平台数据的, 不止是留言等需要互动的消息, 账号的基础数据也可以一并展示, 如粉丝量、播放量等. 目前已发布0.0.1版本, 该版本只支持M1芯片的Mac.

## 使用介绍

在主页下载`platform-listener-arm64.dmg`, 双击进行安装.

![image-20221020175754527](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210201757567.png)

将`Platform Listener`拖入`Applications`即可. 运行后, 并不会弹出任何窗口. 但是在菜单栏将会出现一个新的图标.

![](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210201759298.png)

点击`偏好设置`进入设置界面, 我们以B站设置为例.

![image-20221020180032653](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210201800685.png)

整体界面是这个样子, 你需要输入对应站点的`cookie`, 随便找个请求拷贝下即可.

![image-20221020180531650](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210201805678.png)

在分组设置中, 可以设置需要的卡片.

![image-20221020181014618](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210201810659.png)

之后再打开B站的监听器

![image-20221020180615092](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210201806126.png)

<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210201807897.png" alt="image-20221020180713862" style="zoom:50%;" />

此时你就会看到你账号的相关数据. 在刚才的偏好设置中, 我们的卡片有个绿色的点.

![image-20221020181116497](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210201811531.png)

这个绿点可以通过点击进行开启和关闭. 当绿点亮时, 系统将认为该数据需要在数量变多时进行系统通知, 如你原先的留言是0条, 定时刷新后得到了1条数据, 则进行系统通知. 通常建议只有交互类型的数据才开启, 对于粉丝量等积累型数据不必开启.

<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210202119559.png" alt="image-20221020211943529" style="zoom:50%;" />

为了能够正常通知, 你需要确保在系统中开启了相应的通知权限.

<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210202123251.png" alt="image-20221020212321209" style="zoom:50%;" />

需要注意, `cookie`都会有过期的情况. 不同站点过期时间不一样. 一旦过期, 将会出现鉴权错误.

<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210202125477.png" alt="image-20221020212522442" style="zoom:50%;" />

你只需要在偏好设置中重新设置最新的`cookie`即可. 

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
 - [ ] 区分开发与生产环境, 用于设置一些默认配置, 如console.
 - [ ] 使用`electron-builder`代替`electron-packager`+`electron-installer-dmg`.
 - [ ] 引入`gulp`, 命令式解决构建流程.
 - [ ] 消息通知的绿点增加文案说明.
 - [ ] 恢复默认不能重置cookies.
 - [ ] 超链接、卡片与链接绑定, 而不是写死, 通过设置项开启或关闭.
 - [ ] icon增加黑暗模式.
 - [ ] 提高代码抽象度, 复用业务逻辑.

## 本地开发

```bash
npm run start
```

目前本地开发都是正常的, 一键启动. 很舒服

## 打包流程

执行`npm run build:web`, 会生成一个`dist/web`目录. 将根目录的`electron`拷贝至`dist/web`下. 修改`dist/web/electron`中的下列文件
```js
// tray.js
const trayMenu = new Tray(path.join(__dirname, '../menu-icon.png'));
// window.js
browserWindow.loadURL(
  url.format({
    pathname: path.join(__dirname, `/../index.html`),
    protocol: 'file:',
    slashes: true,
    hash: `/${routePath}`,
  }),
);
```
之后再在`dist/web`下创建`package.json`
```json
{
  "version": "0.0.1",
  "main": "electron/main.js",
  "dependencies": {
    "dayjs": "^1.11.5",
    "electron-store": "^8.1.0",
    "uuid": "^9.0.0"
  }
}
```
之后再执行
```bash
npm run build
```

在`dist/electron`下会存在一个`dmg`文件, 安装即可.