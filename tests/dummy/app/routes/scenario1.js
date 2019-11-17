import Route from '@ember/routing/route';
import request from '../utils/request';

export default class Scenario1Route extends Route {
  model() {
    return request('/scenario1');
  }
}
