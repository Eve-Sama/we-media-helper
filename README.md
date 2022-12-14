<p align="center">
    <img width="230" src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251258890.png">
</p>
<h1 align="center">
We Media Helper
</h1>
<p align="center">
自媒体大数据平台, 定时获取你的个人账号数据, 关键信息及时通知, 让你轻松开启多线程模式!
</p>

<p align="center">
<img src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251418921.png">
<p>

## ✨ 特性

- 展示个人账号数据, 海量指标一览无余.
- 自定义定时刷新, 让最新的数据向你奔赴而来.
- 自定义卡片通知, 让互动消息第一时间向你报道.
- 自定义分组卡片, 你的数据大屏你做主.
- 多展示模式, 单屏 or 多屏? 你说了算.
- 多平台支持, 支持Mac、Windows.

## 📦 使用介绍

### 1. 下载并安装

在[这里](https://github.com/Eve-Sama/we-media-helper/releases)下载适配设备的安装包进行安装. 双击进运行后, 并不会弹出任何窗口. 但是在`菜单栏`将会出现一个新的图标.

![image-20221103105718981](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202211031057006.png)

### 2. 设置cookie

点击`监听器设置`进入设置界面, 我们以B站设置为例.

![image-20221025142009847](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251420883.png)

整体界面是这个样子, 你需要输入对应站点的`cookie`, 随便找个请求拷贝下即可.

> 请求只有和域名一致时才会携带`cookie`, 而一般站点都有一些非自己域名的请求, 所以并非所有请求都有`cookie`, 注意看下域名.

![image-20221025142418338](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251424376.png)

需要注意, `cookie`都会有过期的情况. 不同站点过期时间不一样. 一旦过期, 将会出现鉴权错误. 你只需要在`监听器设置`中重新设置最新的`cookie`即可. 

![image-20221025143814358](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251438398.png)

### 3. 设置分组

在分组设置中, 可以设置需要的卡片.

![image-20221025142729355](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251427375.png)

### 4. 设置通知

分组的卡片有个绿色的点. **这个绿点可以通过点击进行开启和关闭. 当绿点亮时, 系统将认为该数据需要在数量变多时进行系统通知**. 如你原先的留言是0条, 定时刷新后得到了1条数据, 则进行系统通知. 通常建议只有交互类型的数据才开启, 对于粉丝量等积累型数据不必开启.

![image-20221020181116497](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251255298.png)

为了能够正常进行系统通知, 请确保在系统中开启了相应的通知权限.

![image-20221025143900864](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251439904.png)

### 5. 开启数据大屏

之后再打开B站的监听器

![image-20221103105858854](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202211031058886.png)

建议将大数据面板放在多余的显示器上, 逼格拉满, 闲时瞄一眼岂不妙哉?

![image-20221025141837889](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251429127.png)

当开启了通知的卡片有数据新增时, 软件会进行系统通知, 点击图标即可跳转到相应的网页进行查看.

![image-20221025145200686](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251452726.png)

如果既有多个自媒体平台需求, 又不想开启多个窗口, 可以开启`单屏模式`, 以tab切换的方式将他们聚合在一个窗口中.

![image-20221103110241976](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202211031102009.png)

![image-20221103110033511](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202211031100552.png)

## 🔨路线图

### 💪feat

 - [ ] 将 Electron 改版为 TypeScript 版本(need help).
 - [ ] 文档补充新建模块的能力.
 - [ ] node_modules打包进去了, 需要优化体积.
 - [ ] 增加配置导入导出.

### 🐛fix

## 🙋FAQ

### 卡片上显示'字段异常!'是什么意思?

![image-20221025145052415](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202210251450458.png)

因为系统读取的是人家的接口, 因此, 一旦接口发生改动, 将导致可能读不到字段.
```javascript
{
  data: {
    vme50: true
  }
}
// const vme50 = obj.data.vme50; // true
// 某一天, 接口字段结构发生了改变
{
  data: {
    kfc: {
      vme50: true
    }
  }
}
// const vme50 = obj.data.vme50; // undefined
```
读不到字段有两种情况
 - 字段位置变了
 - 字段被删除了

不论哪一种, 都将导致该字段显示`字段异常`. 建议暂时取消该卡片. 如果是第一种情况, 我会尽快修改读取逻辑, 发布新版本后就正常了. 而如果是第二种情况, 我会在新版本的`监听器设置`中删除该卡片选项, 并自动从你已保存的配置中删除该卡片.

### 为什么开启了卡片跳转链接, 但有些卡片点击后无反应?

因为不是所有卡片都有相应的页面的. 如掘金的点赞总量, 该字段的相关接口在个人主页. 但是主页的URL是需要拼接你的`uid`的. 而本软件遵循`克制`的原则开发, 能不+功能就不+功能, 以保持简洁性. 因此当相关主页`URL`依赖额外参数时, 不提供跳转链接.

## 🧑‍💻本地开发

```bash
npm run start
```

## 🚀打包构建

```bash
npm run build
```