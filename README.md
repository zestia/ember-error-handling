# @zestia/ember-error-handling

This Ember addon provides a top level error handler for your application.

It also allows specific errors to be squelched (ignored completely), which is paricularly useful when testing.

### Installation

```
ember install @zestia/ember-error-handling
ember generate instance-initializer error-handling
```

### Set up

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

### Example

```javascript
test('something', async function(assert) {
  assert.expect(1);

  errorHandlingService.squelch(error => {
    // Squelch can be called multiple times
  });
});
```
