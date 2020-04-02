import Service from '@ember/service';
import Ember from 'ember';
import RSVP from 'rsvp';

export default class ErrorHandlingService extends Service {
  squelchedErrors = [];
  squelchHandlers = [];

  constructor() {
    super(...arguments);
    this._setupErrorHandler();
    this._setupRSVPHandler();
  }

  squelch(func) {
    this.squelchHandlers.push(func);
  }

  get hasHandler() {
    return typeof this.onerror === 'function';
  }

  _setupErrorHandler() {
    const originalOnError = Ember.onerror;

    Ember.onerror = (error) => {
      if (typeof originalOnError === 'function') {
        originalOnError.call(Ember, error);
      }

      this._unhandledError(error);
    };
  }

  _setupRSVPHandler() {
    RSVP.on('error', this._unhandledRSVP.bind(this));
  }

  _unhandledError(error) {
    return this._handle(error);
  }

  _unhandledRSVP(error) {
    return this._handle(error);
  }

  _handle(error) {
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
    return this.squelchHandlers.some((squelch) => squelch(error));
  }
}
