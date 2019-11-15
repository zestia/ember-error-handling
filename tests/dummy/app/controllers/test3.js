import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import request from '../utils/request';

export default class Test3Controller extends Controller {
  @action
  loadData() {
    return request('/test3').then(data => {
      set(this, 'data', data);
    });
  }
}
