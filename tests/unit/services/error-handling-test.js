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
        throw testError;
      });
    });

    test('top level error handler', function(assert) {
      assert.expect(2);

      let capturedError;

      const errorHandlingService = this.owner.lookup('service:error-handling');
      errorHandlingService.onerror = error => (capturedError = error);

      run(() => {
        throw testError;
      });

      assert.deepEqual(capturedError, testError);
      assert.deepEqual(errorHandlingService.squelchedErrors, []);
    });

    test('squelching', function(assert) {
      assert.expect(2);

      let capturedError;

      const errorHandlingService = this.owner.lookup('service:error-handling');
      errorHandlingService.onerror = error => (capturedError = error);
      errorHandlingService.squelch(error => error === testError);

      run(() => {
        throw testError;
      });

      assert.strictEqual(capturedError, undefined);
      assert.deepEqual(errorHandlingService.squelchedErrors, [testError]);
    });

    test('Ember.onerror', function(assert) {
      assert.expect(3);

      Ember.onerror = () => {
        assert.step('original error handler');
      };

      const errorHandlingService = this.owner.lookup('service:error-handling');

      errorHandlingService.onerror = () => {
        assert.step('top level error handler');
      };

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
      assert.expect(2);

      let capturedError;

      const errorHandlingService = this.owner.lookup('service:error-handling');
      errorHandlingService.onerror = error => (capturedError = error);

      reject(testError);

      await settled();

      assert.deepEqual(capturedError, testError);
      assert.deepEqual(errorHandlingService.squelchedErrors, []);
    });

    test('squelching', async function(assert) {
      assert.expect(2);

      let capturedError;

      const errorHandlingService = this.owner.lookup('service:error-handling');
      errorHandlingService.onerror = error => (capturedError = error);
      errorHandlingService.squelch(error => error === testError);

      reject(testError);

      await settled();

      assert.strictEqual(capturedError, undefined);
      assert.deepEqual(errorHandlingService.squelchedErrors, [testError]);
    });
  });
});
