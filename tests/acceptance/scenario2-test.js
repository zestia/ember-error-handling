import { module, test } from 'qunit';
import { click, visit, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Pretender from 'pretender';

module('acceptance:scenario2', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('fetch success', async function(assert) {
    assert.expect(2);

    this.server.get('/scenario2', () => {
      return [200, {}, 'Scenario 2'];
    });

    await visit('/scenario2');
    await click('button');

    assert.equal(
      currentRouteName(),
      'scenario2',
      'navigates to scenario 2 route'
    );

    assert
      .dom(this.element)
      .includesText('Scenario 2', 'scenario 2 is displayed');
  });

  test('handled fetch failure', async function(assert) {
    assert.expect(2);

    this.server.get('/scenario2', () => {
      return [500, {}];
    });

    await visit('/scenario2');
    await click('button');

    assert.equal(
      currentRouteName(),
      'scenario2',
      'does not navigate to the error route'
    );

    assert
      .dom(this.element)
      .includesText(
        'Internal Server Error',
        'the error message is displayed and considered handled'
      );
  });
});
