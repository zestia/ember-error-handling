import { module, test } from 'qunit';
import { visit, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Pretender from 'pretender';

module('acceptance:test1', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('model hook fetch success', async function(assert) {
    assert.expect(2);

    this.server.get('/test1', () => {
      return [200, {}, 'Hello World'];
    });

    await visit('/test1');

    assert.equal(currentRouteName(), 'test1');
    assert.dom(this.element).includesText('Hello World');
  });

  test('model hook fetch failure', async function(assert) {
    assert.expect(2);

    this.server.get('/test1', () => {
      return [500, {}];
    });

    await visit('/test1');

    assert.equal(currentRouteName(), 'error');
    assert.dom(this.element).includesText('An error occurred');
  });
});
