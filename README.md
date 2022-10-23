## 业务背景

像B站、掘金这类网站, 评论都是通过站内信进行通知的. 这会导致用户的留言, 往往要等到我打开站点的时候才能得到回复, 我无法实时得知最新的留言数据, 如果使用轮训则过于麻烦. 因此, 我开发了这款"Platform Listener", 顾名思义, 主要是用于监听平台数据的, 不止是留言等需要互动的消息, 账号的基础数据也可以一并展示, 如粉丝量、播放量等. 目前仅支持Mac系统, Windows因为我自己没有需求, 所以一直也没配置, 欢迎来个PR.

## 使用介绍

在[这里](https://github.com/Eve-Sama/platform-listener/releases)下载`platform-listener-arm64.dmg`, 双击进行安装.

![image-20221020175754527](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052964.png)

将`Platform Listener`拖入`Applications`即可. 运行后, 并不会弹出任何窗口. 但是在菜单栏将会出现一个新的图标.

![](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052979.png)

点击`偏好设置`进入设置界面, 我们以B站设置为例.

![image-20221020180032653](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052063.png)

整体界面是这个样子, 你需要输入对应站点的`cookie`, 随便找个请求拷贝下即可. 注意一个知识点, 请求只有和域名一致时才会携带`cookie`, 而一般站点都有一些非自己域名的请求, 所以并非所有请求都有`cookie`, 注意看下域名.

![image-20221020180531650](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052139.png)

在分组设置中, 可以设置需要的卡片.

![image-20221020181014618](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052198.png)

之后再打开B站的监听器

![image-20221020180615092](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052252.png)

<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052335.png" alt="image-20221020180713862" style="zoom:50%;" />

此时你就会看到你账号的相关数据. 在刚才的偏好设置中, 我们的卡片有个绿色的点.

![image-20221020181116497](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052368.png)

这个绿点可以通过点击进行开启和关闭. 当绿点亮时, 系统将认为该数据需要在数量变多时进行系统通知, 如你原先的留言是0条, 定时刷新后得到了1条数据, 则进行系统通知. 通常建议只有交互类型的数据才开启, 对于粉丝量等积累型数据不必开启.

<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052435.png" alt="image-20221020211943529" style="zoom:50%;" />

为了能够正常通知, 你需要确保在系统中开启了相应的通知权限.

<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052603.png" alt="image-20221020212321209" style="zoom:50%;" />

需要注意, `cookie`都会有过期的情况. 不同站点过期时间不一样. 一旦过期, 将会出现鉴权错误.

<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220052646.png" alt="image-20221020212522442" style="zoom:50%;" />

你只需要在偏好设置中重新设置最新的`cookie`即可. 

## roadmap

### feat

 - [ ] 将 Electron 改版为 TypeScript 版本(试过2次了, 老是会出问题).
 - [ ] 制作欢迎页.
 - [ ] 为各个窗口设置合适的尺寸大小.
 - [ ] 使用`electron-builder`代替`electron-packager`+`electron-installer-dmg`.
 - [ ] 增加自动更新
 - [ ] 超链接、卡片与链接绑定, 而不是写死, 通过设置项开启或关闭.
 - [ ] icon增加黑暗模式.
### fix

 - [ ] 开启设置页面时, 那边的本地状态和展示页不一致.
 - [ ] 设置cookie时, 失败的话无弹窗提示.
 
## 本地开发

```bash
npm run start
```

## 打包流程

你可以一键打包目前支持的全部平台, 也可以单独构建某个特定的平台, 详情查看`package.json`

```bash
npm run build:all
```

<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210220121857.png" alt="image-20221022012151818" style="zoom:50%;" />

最终产生的安装文件位于`dist/electron`

