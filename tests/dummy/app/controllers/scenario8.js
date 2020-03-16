import Controller from '@ember/controller';
import { action } from '@ember/object';
import { run } from '@ember/runloop';

export default class Scenario8Controller extends Controller {
  @action
  showData() {
    run(() => {
      throw new Error('scenario8error');
    });
  }
}
