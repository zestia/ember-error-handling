import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('acceptance:scenario1', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.errorHandlingService = this.owner.lookup('service:error-handling');
  });

  test('scenario 1', async function (assert) {
    assert.expect(1);

    await visit('/scenario1');
    await click('button');

    assert.dom(this.element).includesText('scenario1data', 'no error occurred');
  });
});
