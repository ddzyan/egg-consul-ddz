'use strict';
const _ = require('lodash');

module.exports = app => {
  return {
    schedule: {
      interval: app.config.consulDdz.findTime || '1m',
      immediate: true, // 这个定时 任务会在应用启动并 ready 后立刻执行一次这个定时任务
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的,
      disable: false,
    },
    async task() {
      const findServicePromiseArr = [];
      const { serviceList } = app.config.consulDdz;
      serviceList.reduce((pre, service) => {
        pre.push(app.findConsulService(service));
        return pre;
      }, findServicePromiseArr);
      const result = await Promise.all(findServicePromiseArr);
      if (_.isEqual(app.consulServices, ...result)) {
        app.coreLogger.info('app.consulServices 未更新');
      } else {
        Object.assign(app.consulServices, ...result);
        app.coreLogger.info('app.consulServices 更新成功', JSON.stringify(app.consulServices));

      }
    },
  };
};
