'use strict';

module.exports = () => {
  const config = {
    consulDdz: {
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
  };

  return config;
};
