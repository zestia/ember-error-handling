import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class Scenario5Controller extends Controller {
  @tracked error;

  @action
  async loadData() {
    try {
      await this._loadData();
    } catch (error) {
      this.error = error.message;
    }
  }

  _loadData() {
    throw new Error('scenario5error');
  }
}
