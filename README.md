# @zestia/ember-error-handling

<a href="https://badge.fury.io/js/%40zestia%2Fember-error-handling"><img src="https://badge.fury.io/js/%40zestia%2Fember-error-handling.svg" alt="npm version" height="18"></a> &nbsp; <a href="http://travis-ci.org/zestia/ember-error-handling"><img src="https://travis-ci.org/zestia/ember-error-handling.svg?branch=master"></a> &nbsp; <a href="https://david-dm.org/zestia/ember-error-handling#badge-embed"><img src="https://david-dm.org/zestia/ember-error-handling.svg"></a> &nbsp; <a href="https://david-dm.org/zestia/ember-error-handling#dev-badge-embed"><img src="https://david-dm.org/zestia/ember-error-handling/dev-status.svg"></a> &nbsp; <a href="https://emberobserver.com/addons/@zestia/ember-error-handling"><img src="https://emberobserver.com/badges/-zestia-ember-error-handling.svg"></a>

This Ember addon provides a top level error handler for your application.

It also allows specific errors to be squelched (ignored completely), which is paricularly useful when testing.

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

  errorHandlingService.onError(error => {
    // Here is a good place to send the error to a third party.
  });

  errorHandlingService.squelch(error => {
    // Return true to squelch
  });
}

export default {
  name: 'error-handling',
  initialize
};
```

## Example

```javascript
test('something', async function(assert) {
  assert.expect(1);

  errorHandlingService.squelch(error => {
    // Squelch can be called multiple times
  });
});
```
