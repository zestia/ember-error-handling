import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('acceptance:scenario3', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.errorHandlingService = this.owner.lookup('service:error-handling');
  });

  test('scenario 3', async function (assert) {
    assert.expect(1);

    this.errorHandlingService.squelch((error) => {
      return error.message.match('scenario3error');
    });

    await visit('/scenario3');
    await click('button');

    assert
      .dom(this.element)
      .includesText(
        'error not handled',
        'error was thrown, and not handled, but test still passes'
      );
  });
});
