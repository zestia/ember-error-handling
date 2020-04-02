import { module, skip } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('acceptance:scenario7', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.errorHandlingService = this.owner.lookup('service:error-handling');
  });

  skip('scenario 7', async function (assert) {
    assert.expect(1);

    this.errorHandlingService.squelch((error) => {
      // Can't get here :(

      return error.message.match('scenario7error');
    });

    await visit('/scenario7');
    await click('button');

    assert.ok(true, 'error thrown, and test fails :(');
  });
});
