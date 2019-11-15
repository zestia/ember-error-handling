import Service from '@ember/service';
import Ember from 'ember';
import RSVP from 'rsvp';

export default class ErrorHandlingService extends Service {
  squelchedErrors = [];
  squelchHandlers = [];

  errorHandler = error => {
    throw error;
  };

  constructor() {
    super(...arguments);
    this._setupErrorHandling();
  }

  squelch(func) {
    this.squelchHandlers.push(func);
  }

  onError(errorHandler) {
    this.errorHandler = errorHandler;
  }

  _setupErrorHandling() {
    Ember.onerror = this._errorHandler.bind(this);
    RSVP.on('error', this._errorHandler.bind(this));
  }

  _errorHandler(error) {
    if (this._shouldSquelch(error)) {
      this.squelchedErrors.push(error);
    } else {
      this.errorHandler(error);
    }
  }

  _shouldSquelch(error) {
    return this.squelchHandlers.some(squelch => squelch(error));
  }
}
