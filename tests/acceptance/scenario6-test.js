import { module, skip } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('acceptance:scenario6', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.errorHandlingService = this.owner.lookup('service:error-handling');
  });

  skip('scenario 6', async function(assert) {
    assert.expect(1);

    this.errorHandlingService.squelch(error => {
      // Can't get here :(

      return error.message.match('scenario6error');
    });

    await visit('/scenario6');
    await click('button');

    assert
      .dom(this.element)
      .includesText(
        'error not handled',
        'error was thrown, and not handled, test fails :('
      );
  });
});
