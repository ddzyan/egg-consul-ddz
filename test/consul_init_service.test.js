'use strict';

const mock = require('egg-mock');
const assert = require('assert');

describe('test/consul_init_service.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/consul-ddz-test',
    });
    return app.ready();
  });

  after(() => app.close());
  // afterEach(mock.restore);

  it('consulServices load ', () => {
    assert(app.consulServices, 'consulServices 获取服务失败');
  });
});
