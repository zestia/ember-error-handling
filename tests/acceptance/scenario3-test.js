import { module, test } from 'qunit';
import { click, visit, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Pretender from 'pretender';
import { AJAXError } from '../../utils/errors';

module('acceptance:scenario3', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender();
    this.errorHandlingService = this.owner.lookup('service:error-handling');
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('fetch success', async function(assert) {
    assert.expect(2);

    this.server.get('/scenario3', () => {
      return [200, {}, 'Scenario 3'];
    });

    await visit('/scenario3');
    await click('button');

    assert.equal(
      currentRouteName(),
      'scenario3',
      'navigates to scenario 3 route'
    );

    assert
      .dom(this.element)
      .includesText('Scenario 3', 'scenario 3 is displayed');
  });

  test('unhandled fetch failure', async function(assert) {
    assert.expect(1);

    this.errorHandlingService.squelch(error => {
      return error instanceof AJAXError;
    });

    this.server.get('/scenario3', () => {
      return [500, {}];
    });

    await visit('/scenario3');
    await click('button');

    assert.equal(
      currentRouteName(),
      'scenario3',
      'despite there being an unhandled error, this test still passes ' +
        'due to it being specifically ignored in this circumstance'
    );
  });
});
