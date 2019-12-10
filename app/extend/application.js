'use strict';
const util = require('util');
const Consul = require('consul');

const DEFAULT_CONSUL_CONFIG = {
  promisify: true,
  secure: false,
  host: '10.199.6.35',
  port: 8500,
};

module.exports = {
  format(msg) {
    let rest = '';
    if (msg instanceof Error) {
      rest = util.format(
        'egg-consul-ddz %s: %s\nData:%j\nfunctionName:%s\n\n',
        msg.name,
        msg.stack,
        msg.data,
        msg.function
      );
    } else {
      rest = util.format(
        'egg-consul-ddz \n%s',
        msg
      );
    }
    this.coreLogger.info(rest);
  },

  // consul初始化
  async  initConsul() {
    const { consulDdz } = this.config;
    try {
      if (!consulDdz && !consulDdz.server) {
        throw new ReferenceError('config.consulDdz is undefind');
      }
      const consul = new Consul(Object.assign(DEFAULT_CONSUL_CONFIG, consulDdz.server));
      const checks = await consul.agent.check.list();
      const services = await consul.agent.service.list();
      if (Object.keys(checks).length <= 0) {
        throw new RangeError('checks list is 0');
      }

      if (Object.keys(services).length <= 0) {
        throw new RangeError('services list is 0');
      }
      this.consulServices = {};
      this.consul = consul;
    } catch (error) {
      if (error instanceof Error) {
        error.function = 'initClient';
        error.data = consulDdz;
      }
      this.format(error);
    }
  },

  // 注册自己的服务
  async  registerConsulService() {
    const { consulDdz } = this.config;
    try {
      if (consulDdz && consulDdz.register && consulDdz.client) {
        await this.consul.agent.service.register(consulDdz.client);
      }
    } catch (error) {
      if (error instanceof Error) {
        error.function = 'registerService';
        error.data = consulDdz;
      }
      this.format(error);
    }

  },

  // 注册本地注册在consul的服务
  async  deregisterConsulService() {
    const { config: { consulDdz } } = this;
    try {
      if (consulDdz && consulDdz.register && consulDdz.client) {
        await Promise.all([
          this.consul.agent.service.deregister(consulDdz.client.name),
          this.consul.agent.check.deregister(consulDdz.client.name),
        ]);
      }
    } catch (error) {
      if (error instanceof Error) {
        error.function = 'deregisterService';
        error.data = consulDdz;
      }
      this.format(error);
    }
  },

  // 获取，检查和添加consul上健康的服务信息
  async  findConsulService(serviceOption) {
    const { referName, service } = serviceOption;
    try {
      if (this.consul) {
        const result = await this.consul.health.service({
          service,
          passing: true,
        });
        if (result.length > 0) {
          for (const service of result) {
            const { Service, Checks } = service;
            const { Address, Port } = Service;
            for (const check of Checks) {
              if (check.Status === 'passing' && check.CheckID !== 'serfHealth') {
                const serviceOptin = {
                  ip: Address,
                  port: Port,
                };
                return {
                  [referName]: serviceOptin,
                };
              }
            }
          }
        }
        throw new RangeError(`未发现状态为 passing 的 ${service} 服务`);
      }
      throw new ReferenceError('consul 服务未注册成功');
    } catch (error) {
      if (error instanceof Error) {
        error.function = 'findService';
        error.data = serviceOption;
      }
      this.format(error);
    }
  },
};
