import Route from '@ember/routing/route';
import request from '../utils/request';

export default class Test1Route extends Route {
  model() {
    return request('/test1');
  }
}
