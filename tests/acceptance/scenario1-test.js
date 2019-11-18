import { module, test } from 'qunit';
import { visit, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Pretender from 'pretender';

module('acceptance:scenario1', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('model hook fetch success', async function(assert) {
    assert.expect(2);

    this.server.get('/scenario1', () => {
      return [200, {}, 'Scenario 1'];
    });

    await visit('/scenario1');

    assert.equal(
      currentRouteName(),
      'scenario1',
      'navigates to scenario 1 route'
    );

    assert
      .dom(this.element)
      .includesText('Scenario 1', 'scenario 1 is displayed');
  });

  test('model hook fetch failure', async function(assert) {
    assert.expect(2);

    this.server.get('/scenario1', () => {
      return [500, {}];
    });

    await visit('/scenario1');

    assert.equal(
      currentRouteName(),
      'error',
      'automatically redirects to the error route'
    );

    assert
      .dom(this.element)
      .includesText('An error occurred', 'error template is displayed');
  });
});
