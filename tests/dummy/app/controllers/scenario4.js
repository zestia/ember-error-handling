import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class Scenario4Controller extends Controller {
  @tracked data;

  @action
  async loadData() {
    this.data = await this._loadData();
  }

  _loadData() {
    return 'scenario4data';
  }
}
