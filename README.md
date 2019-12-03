## 简介
egg-consul-ddz 插件，功能包括：
1. 应用启动时，注册服务
    1. 设置定时任务，循环获取consul注册的服务，并且检查健康信息，将配置的指定名称并且没有问题的服务信息保存在内存中
2. 从内存中获取指定名称的服务
3. 应用关闭时，注销consul上的服务

### 更新记录
#### 1.0.1
1. 修改获取 consul 注册服务方法，为只获取状态为通过的服务
2. 将 consul 相关方法转移到 application 中，在引用时无需再传入 app 对象
3. 配置定时任务 schedule ，每隔 1m 分钟去 consul 获取，检查和更新健康服务信息 

#### 1.0.2
1. 解决 format 方法引用错误bug

#### 1.0.3
1. 修改日志输出中对findService方法输出错误BUG
2. 每次定时检查consul服务时候，增加获取成功的服务日志输出

## 使用
需要在config.*.js 文件中配置以下参数：
```js
 consulConfig: {
      findTime: '1m', // 发现服务的间隔时间
      server: {
        host: '10.199.6.35',
        port: 8500,
        secure: false,
      },
      serviceList: [ // 服务发现列表
        {
          referName: 'plutusCore', // 引用名，后续可用 app.services.referName 访问服务
          service: 'plutus-core', // 服务id
        },
        {
          referName: 'plutusGeneral',
          service: 'plutus-general',
        },
      ],
      register: false,
      client: {
        name: 'egg-gateway-eos', // 服务每次
        id: 'egg-gateway-eos', // 服务Id，可以与名称一致
        tags: 'egg-gateway-eos', // 标签信息
        address: '127.0.0.1', // 服务地址
        port: 8500, // 服务端口号
        check: {
          http: '127.0.0.1:7000', // http服务地址
          interval: '5s', // 健康检测轮询时间
          timeout: '10s', // 超时时间
          status: 'critical', // 初始化服务状态
        },
      },
    },
```

插件配置,启动插件
```js
// plugin.js
exports.cors = {
  enable: true,
  package: "egg-consul-ddz"
};
```

初始化成功后，获取的consul注册服务会被挂载再application实例化的app对象上，使用方式如下
```js
app.consulServices.plutusCore
```

服务如果注册成功，会将所有服务信息挂载在 application 实例化后的 app 对象 consulServices 属性上，可以通过如下方式获得
```js
// 获得服务信息
app.consulServices[referName] 
```