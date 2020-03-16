import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class Scenario4Controller extends Controller {
  @action
  async loadData() {
    await this._loadData();
  }

  _loadData() {
    throw new Error('scenario6error');
  }
}
