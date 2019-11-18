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

  get hasHandler() {
    return typeof this.onerror === 'function';
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
      return;
    }

    if (this.hasHandler) {
      this.onerror(error);
    }

    if (Ember.testing || !this.hasHandler) {
      throw error;
    }
  }

  _shouldSquelch(error) {
    return this.squelchHandlers.some(squelch => squelch(error));
  }
}
