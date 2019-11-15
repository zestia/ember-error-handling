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

  module('run loop', function() {
    test('normal behaviour', function(assert) {
      assert.expect(2);

      let capturedException;

      errorHandlingService.squelch(() => false);
      errorHandlingService.onError(error => (capturedException = error));

      run(() => {
        throw error;
      });

      assert.deepEqual(capturedException, error, 'fires onError');

      assert.deepEqual(
        errorHandlingService.squelchedErrors,
        [],
        'error is not squelched'
      );
    });

    test('squelching', function(assert) {
      assert.expect(2);

      let capturedException;

      errorHandlingService.squelch(() => true);
      errorHandlingService.onError(error => (capturedException = error));

      run(() => {
        throw error;
      });

      assert.strictEqual(capturedException, undefined, 'does not fire onError');

      assert.deepEqual(
        errorHandlingService.squelchedErrors,
        [error],
        'error is squelched'
      );
    });
  });

  module('unhandled promise rejections', function() {
    test('normal behaviour', async function(assert) {
      assert.expect(2);

      let capturedException;

      errorHandlingService.squelch(() => false);
      errorHandlingService.onError(error => (capturedException = error));

      reject(error);

      await settled();

      assert.deepEqual(capturedException, error, 'fires onError');

      assert.deepEqual(
        errorHandlingService.squelchedErrors,
        [],
        'error is not squelched'
      );
    });

    test('squelching', async function(assert) {
      assert.expect(2);

      let capturedException;

      errorHandlingService.squelch(() => true);
      errorHandlingService.onError(error => (capturedException = error));

      reject(error);

      await settled();

      assert.strictEqual(capturedException, undefined, 'does not fire onError');

      assert.deepEqual(
        errorHandlingService.squelchedErrors,
        [error],
        'error is squelched'
      );
    });
  });
});
