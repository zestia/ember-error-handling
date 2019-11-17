import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import request from '../utils/request';

export default class Scenario3Controller extends Controller {
  @action
  loadData() {
    return request('/scenario3').then(data => {
      set(this, 'data', data);
    });
  }
}
