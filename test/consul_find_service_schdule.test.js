'use strict';

const mock = require('egg-mock');
const assert = require('assert');

describe('test/consul_find_service_schdule.test.js', () => {
  it('should schedule work fine', async () => {
    const app = mock.app();
    await app.ready();
    await app.runSchedule('find_consul');
    assert(app.consulServices.plutusCore, 'plutusCore 服务不存在');
  });
});
