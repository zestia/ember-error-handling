import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('acceptance:scenario8', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.errorHandlingService = this.owner.lookup('service:error-handling');
  });

  test('scenario 8', async function(assert) {
    assert.expect(1);

    this.errorHandlingService.squelch(error => {
      return error.message.match('scenario8error');
    });

    await visit('/scenario8');
    await click('button');

    assert.ok(true, 'error thrown, but test still passes');
  });
});
