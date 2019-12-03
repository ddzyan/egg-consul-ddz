'use strict';


module.exports = app => {
  return {
    schedule: {
      interval: app.config.consulConfig.findTime || '1m',
      immediate: true, // 这个定时 任务会在应用启动并 ready 后立刻执行一次这个定时任务
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的,
      disable: false,
    },
    async task() {
      const findServicePromiseArr = [];
      const { serviceList } = app.config.consulConfig;
      serviceList.reduce((pre, service) => {
        pre.push(app.findService(service));
        return pre;
      }, findServicePromiseArr);
      await Promise.all(findServicePromiseArr);
    },
  };
};
