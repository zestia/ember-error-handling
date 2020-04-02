import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Promise } from 'rsvp';

export default class Scenario2Controller extends Controller {
  @tracked error;

  @action
  loadData() {
    return this._loadData().catch((error) => {
      this.error = error.message;
    });
  }

  _loadData() {
    return new Promise((resolve, reject) => {
      reject(new Error('scenario2error'));
    });
  }
}
