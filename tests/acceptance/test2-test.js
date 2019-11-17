import { module, test } from 'qunit';
import { click, visit, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Pretender from 'pretender';

module('acceptance:test2', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('fetch success', async function(assert) {
    assert.expect(2);

    this.server.get('/test2', () => {
      return [200, {}, 'Hello World'];
    });

    await visit('/test2');
    await click('button');

    assert.equal(currentRouteName(), 'test2');
    assert.dom(this.element).includesText('Hello World');
  });

  test('handled fetch failure', async function(assert) {
    assert.expect(2);

    this.server.get('/test2', () => {
      return [500, {}];
    });

    await visit('/test2');
    await click('button');

    assert.equal(currentRouteName(), 'test2');
    assert.dom(this.element).includesText('Internal Server Error');
  });
});
