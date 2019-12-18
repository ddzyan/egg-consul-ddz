'use strict';

class AppBootHook {
  constructor(app) {
    this.app = app;
  }
  // 配置文件加载完成
  async configDidLoad() {
    await this.app.initConsul();
    this.app.coreLogger.info('consul init is ready');
    await this.app.registerConsulService();
    this.app.coreLogger.info('consul regist is ready');
  }

  async beforeClose() {
    await this.app.deregisterConsulService();
    this.app.coreLogger.info('consul deregister is ready');
  }
}

module.exports = AppBootHook;
