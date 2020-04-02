import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Promise } from 'rsvp';

export default class Scenario1Controller extends Controller {
  @tracked data;

  @action
  loadData() {
    return this._loadData().then((data) => {
      this.data = data;
    });
  }

  _loadData() {
    return new Promise((resolve) => {
      resolve('scenario1data');
    });
  }
}
