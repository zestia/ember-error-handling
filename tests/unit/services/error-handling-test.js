import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { reject } from 'rsvp';
import { settled } from '@ember/test-helpers';
import { run } from '@ember/runloop';

module('service:error-handling', function(hooks) {
  setupTest(hooks);

  const error = new Error('foo');

  let errorHandlingService;

  hooks.beforeEach(function() {
    errorHandlingService = this.owner.lookup('service:error-handling');
  });

  module('uncaught errors', function() {
    test('normal behaviour', function(assert) {
      assert.expect(1);

      assert.throws(() => {
        throw error;
      });
    });

    test('top level error handler', function(assert) {
      assert.expect(2);

      let capturedException;

      errorHandlingService.onerror = error => (capturedException = error);

      run(() => {
        throw error;
      });

      assert.deepEqual(capturedException, error);
      assert.deepEqual(errorHandlingService.squelchedErrors, []);
    });

    test('squelching', function(assert) {
      assert.expect(2);

      let capturedException;

      errorHandlingService.squelch(() => true);
      errorHandlingService.onerror = error => (capturedException = error);

      run(() => {
        throw error;
      });

      assert.strictEqual(capturedException, undefined);
      assert.deepEqual(errorHandlingService.squelchedErrors, [error]);
    });

    test('Ember.onerror', function(assert) {
      assert.expect(3);

      const originalOnError = Ember.onerror;

      Ember.onerror = () => {
        assert.step('original error handler');
        originalOnError();
      };

      errorHandlingService.onerror = () => {
        assert.step('top level error handler');
      };

      run(() => {
        throw error;
      });

      assert.verifySteps(['original error handler', 'top level error handler']);
    });
  });

  module('unhandled promise rejections', function() {
    test('normal behaviour', function(assert) {
      assert.expect(1);

      assert.rejects(reject(error));
    });

    test('top level error handler', async function(assert) {
      assert.expect(2);

      let capturedException;

      errorHandlingService.onerror = error => (capturedException = error);

      reject(error);

      await settled();

      assert.deepEqual(capturedException, error);
      assert.deepEqual(errorHandlingService.squelchedErrors, []);
    });

    test('squelching', async function(assert) {
      assert.expect(2);

      let capturedException;

      errorHandlingService.squelch(() => true);
      errorHandlingService.onerror = error => (capturedException = error);

      reject(error);

      await settled();

      assert.strictEqual(capturedException, undefined);
      assert.deepEqual(errorHandlingService.squelchedErrors, [error]);
    });
  });
});
