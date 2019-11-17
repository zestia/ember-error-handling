/* eslint-disable max-nested-callbacks */

import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { reject } from 'rsvp';
import { settled } from '@ember/test-helpers';
import { run } from '@ember/runloop';

module('service:error-handling', function(hooks) {
  setupTest(hooks);

  const testError = new Error('foo');

  module('uncaught errors', function() {
    test('normal behaviour', function(assert) {
      assert.expect(1);

      assert.throws(() => {
        run(() => {
          throw testError;
        });
      });
    });

    test('top level error handler', function(assert) {
      assert.expect(1);

      let capturedError;

      const service = this.owner.lookup('service:error-handling');

      service.onerror = error => (capturedError = error);

      run(() => {
        throw testError;
      });

      assert.deepEqual(capturedError, testError);
    });

    test('no top level error handler', function(assert) {
      assert.expect(0);

      Ember.onerror = () => {};

      this.owner.lookup('service:error-handling');

      run(() => {
        throw testError;
      });
    });

    test('squelching', function(assert) {
      assert.expect(1);

      const service = this.owner.lookup('service:error-handling');

      service.squelch(error => error === testError);

      run(() => {
        throw testError;
      });

      assert.deepEqual(service.squelchedErrors, [testError]);
    });

    test('Ember.onerror', function(assert) {
      assert.expect(3);

      Ember.onerror = () => assert.step('original error handler');

      const service = this.owner.lookup('service:error-handling');

      service.onerror = () => assert.step('top level error handler');

      run(() => {
        throw testError;
      });

      assert.verifySteps(['original error handler', 'top level error handler']);
    });
  });

  module('unhandled promise rejections', function() {
    test('normal behaviour', function(assert) {
      assert.expect(1);

      assert.rejects(reject(testError));
    });

    test('top level error handler', async function(assert) {
      assert.expect(1);

      let capturedError;

      const service = this.owner.lookup('service:error-handling');

      service.onerror = error => (capturedError = error);

      reject(testError);

      await settled();

      assert.deepEqual(capturedError, testError);
    });

    test('squelching', async function(assert) {
      assert.expect(1);

      const service = this.owner.lookup('service:error-handling');

      service.squelch(error => error === testError);

      reject(testError);

      await settled();

      assert.deepEqual(service.squelchedErrors, [testError]);
    });
  });
});
