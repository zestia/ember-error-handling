import Controller from '@ember/controller';
import { Promise } from 'rsvp';
import { action } from '@ember/object';

export default class Scenario2Controller extends Controller {
  @action
  loadData() {
    return this._loadData();
  }

  _loadData() {
    return new Promise((resolve, reject) => {
      reject(new Error('scenario3error'));
    });
  }
}
