'use strict';


module.exports = app => {
  app.beforeStart(async () => {
    // 连接 consu 服务
    await app.initClient();
    // 注册本地服务到consul
    await app.registerService();
  });

  app.beforeClose(async () => {
    // Do some thing before app close.
    await app.deregisterService(app);
  });


  return app;
};
