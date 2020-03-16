import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('acceptance:scenario5', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.errorHandlingService = this.owner.lookup('service:error-handling');
  });

  test('scenario 5', async function(assert) {
    assert.expect(1);

    await visit('/scenario5');
    await click('button');

    assert
      .dom(this.element)
      .includesText(
        'handled error scenario5error',
        'error was caught and handled'
      );
  });
});
