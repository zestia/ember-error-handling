/* eslint-disable max-nested-callbacks, ember/no-ember-testing-in-module-scope */

import Ember from 'ember';
import { module, test, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import { reject } from 'rsvp';
import { settled, validateErrorHandler } from '@ember/test-helpers';
import { run } from '@ember/runloop';

module('service:error-handling', function(hooks) {
  setupTest(hooks);

  const testError = new Error('foo');

  module('uncaught errors', function() {
    test('top level error handler', function(assert) {
      assert.expect(3);

      let capturedError;

      const service = this.owner.lookup('service:error-handling');

      service.onerror = error => (capturedError = error);

      assert.throws(() => {
        run(() => {
          throw testError;
        });
      });

      assert.deepEqual(
        capturedError,
        testError,
        'onerror fires when an error is thrown'
      );

      assert.deepEqual(
        service.squelchedErrors,
        [],
        'no errors are logged as being squelched'
      );
    });

    test('squelching', function(assert) {
      assert.expect(4);

      const service = this.owner.lookup('service:error-handling');

      service.onerror = () => assert.step('onerror');

      service.squelch(() => assert.step('squelch'));

      service.squelch(error => {
        assert.step('squelch');

        return error === testError;
      });

      run(() => {
        throw testError;
      });

      assert.verifySteps(
        ['squelch', 'squelch'],
        'top level error handler is not called, and squelch callbacks are called'
      );

      assert.deepEqual(
        service.squelchedErrors,
        [testError],
        'error is logged as squelched if callback returns true'
      );
    });
  });

  module('unhandled promise rejections', function() {
    // This module specifically tests with no rejection reason,
    // because if a reason is provided, Ember.onerror will handle it
    // not RSVP.on('error'). And we want to test the latter.

    skip('top level error handler', async function(assert) {
      assert.expect(2);

      let capturedError = null;

      const service = this.owner.lookup('service:error-handling');

      service.onerror = error => (capturedError = error);

      reject();

      await settled();

      assert.deepEqual(
        capturedError,
        undefined,
        'onerror fires when an promise rejection is uncaught'
      );

      assert.deepEqual(
        service.squelchedErrors,
        [],
        'no errors are logged as being squelched'
      );
    });

    test('squelching', async function(assert) {
      assert.expect(4);

      const service = this.owner.lookup('service:error-handling');

      service.onerror = () => assert.step('onerror');

      service.squelch(() => assert.step('squelch'));

      service.squelch(() => {
        assert.step('squelch');

        return true;
      });

      reject();

      await settled();

      assert.verifySteps(
        ['squelch', 'squelch'],
        'top level error handler is not called, and squelch callbacks are called'
      );

      assert.deepEqual(
        service.squelchedErrors,
        [undefined],
        'rejection reason is logged as squelched if callback returns true'
      );
    });
  });

  module('Ember.onerror', function(hooks) {
    let originalOnError;

    hooks.beforeEach(function() {
      originalOnError = Ember.onerror;
    });

    hooks.afterEach(function() {
      Ember.onerror = originalOnError;
    });

    test('original handler', function(assert) {
      assert.expect(4);

      Ember.onerror = () => assert.step('original error handler');

      const service = this.owner.lookup('service:error-handling');

      service.onerror = () => assert.step('top level error handler');

      assert.throws(() => {
        run(() => {
          throw testError;
        });
      });

      assert.verifySteps(
        ['original error handler', 'top level error handler'],
        'top level error handler does not overwrite original Ember.onerror'
      );
    });

    test('validate re-throwing', function(assert) {
      assert.expect(1);

      this.owner.lookup('service:error-handling');

      const result = validateErrorHandler();

      assert.ok(
        result.isValid,
        'top level error handler re-throws so that tests will fail'
      );
    });

    test('squelching', function(assert) {
      assert.expect(2);

      Ember.onerror = assert.step('Ember.onerror');

      const service = this.owner.lookup('service:error-handling');

      service.squelch(error => error === testError);

      run(() => {
        throw testError;
      });

      assert.verifySteps(
        ['Ember.onerror'],
        'Ember.onerror still fires despite error being squelched'
      );
    });
  });

  module('Ember.testing', function() {
    let originalTesting;

    hooks.beforeEach(function() {
      originalTesting = Ember.testing;
    });

    hooks.afterEach(function() {
      Ember.testing = originalTesting;
    });

    test('no top error handler', function(assert) {
      assert.expect(1);

      Ember.testing = false;

      this.owner.lookup('service:error-handling');

      assert.throws(
        () => {
          run(() => {
            throw testError;
          });
        },
        `
        if no top level error handler is set, the error is re-thrown so that
        its presence in the console will inform developers.
      `
      );
    });
  });
});
