import Service from '@ember/service';
import Ember from 'ember';
import RSVP from 'rsvp';

export default class ErrorHandlingService extends Service {
  squelchedErrors = [];
  squelchHandlers = [];

  constructor() {
    super(...arguments);
    this._setupEmberOnErrorHandler();
    this._setupEmberRSVPErrorHandler();
  }

  squelch(func) {
    this.squelchHandlers.push(func);
  }

  _setupEmberOnErrorHandler() {
    const originalOnError = Ember.onerror;

    Ember.onerror = error => {
      if (typeof originalOnError === 'function') {
        originalOnError.call(Ember, error);
      }

      this._handleError(error);
    };
  }

  _setupEmberRSVPErrorHandler() {
    RSVP.on('error', this._handleError.bind(this));
  }

  _handleError(error) {
    if (this._shouldSquelch(error)) {
      this.squelchedErrors.push(error);
    } else if (typeof this.onerror === 'function') {
      this.onerror(error);
    }
  }

  _shouldSquelch(error) {
    return this.squelchHandlers.some(squelch => squelch(error));
  }
}
