'use strict';


module.exports = app => {
  app.beforeStart(async () => {
    // 连接 consul 服务
    await app.initClient();
    app.coreLogger.info('consul init is ready');
    // 注册本地服务到consul
    await app.registerService();
    app.coreLogger.info('consul register is ready');

    // await app.runSchedule('find_consul');
  });

  app.beforeClose(async () => {
    // Do some thing before app close.
    await app.deregisterService(app);
    app.coreLogger.info('consul deregister is ready');
  });


  return app;
};
