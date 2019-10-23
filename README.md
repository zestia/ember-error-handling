# @zestia/ember-error-handling

### Installation

```
ember install @zestia/ember-error-handling
ember generate instance-initializer error-handling
```

### Example usage

```javascript
// app/instance-initializers/error-handling.js

export function initialize(appInstance) {
  const errorHandlingService = appInstance.lookup('service:error-handling');

  errorHandlingService.onError(error => {
    // Top level error handler.
    // Here is a good place to send the error to a third party.
  });

  errorHandlingService.squelch(error => {
    // Return true to squelch
  });

  errorHandlingService.squelch(error => {
    // Squelch can be called multiple times
  });
}

export default {
  name: 'error-handling',
  initialize
};
```
