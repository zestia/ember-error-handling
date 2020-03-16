import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class Scenario7Controller extends Controller {
  @action
  showData() {
    throw new Error('scenario7error');
  }
}
