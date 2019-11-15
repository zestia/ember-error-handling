import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import request from '../utils/request';

export default class Test2Controller extends Controller {
  @action
  loadData() {
    return request('/test2')
      .then(data => {
        set(this, 'data', data);
      })
      .catch(error => {
        set(this, 'error', error.message);
      });
  }
}
