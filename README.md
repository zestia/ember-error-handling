# @zestia/ember-error-handling

<p>
  <a href="http://travis-ci.org/zestia/ember-error-handling">
    <img src="https://travis-ci.org/zestia/ember-error-handling.svg?branch=master">
  </a>

  <a href="https://david-dm.org/zestia/ember-error-handling#badge-embed">
    <img src="https://david-dm.org/zestia/ember-error-handling.svg">
  </a>

  <a href="https://david-dm.org/zestia/ember-error-handling#dev-badge-embed">
    <img src="https://david-dm.org/zestia/ember-error-handling/dev-status.svg">
  </a>

  <a href="https://emberobserver.com/addons/@zestia/ember-error-handling">
    <img src="https://emberobserver.com/badges/-zestia-ember-error-handling.svg">
  </a>

  <img src="https://img.shields.io/badge/Ember-%3E%3D%203.12-brightgreen">
</p>

The Ember guides suggest using `Ember.onerror` to handle errors and `Ember.RSVP.on('error')` to handle uncaught promise rejections. More often than not, you want to use the same handler for both these scenarios.

This Ember addon amalgamates the two hooks into a single top level error handler for your application.

It also allows specific errors to be squelched (ignored completely), which is paricularly useful when testing error scenarios.

**Note** If you are using `await` (native promises), rather than `RSVP`, and you still wish to have the ability to squelch errors - you must still wrap the chain with `RSVP.resolve`.

## Installation

```
ember install @zestia/ember-error-handling
ember generate instance-initializer error-handling
```

## Setup

```javascript
// app/instance-initializers/error-handling.js

export function initialize(appInstance) {
  const errorHandlingService = appInstance.lookup('service:error-handling');

  errorHandlingService.onerror = (error) => {
    // Here is a good place to send the error to a third party.
  };

  errorHandlingService.squelch((error) => {
    // Return true to squelch
  });
}

export default {
  name: 'error-handling',
  initialize,
};
```

## Example

```javascript
test('something', async function (assert) {
  assert.expect(1);

  errorHandlingService.squelch((error) => {
    // Squelch can be called multiple times
  });
});
```
