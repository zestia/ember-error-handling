import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('scenario1');
  this.route('scenario2');
  this.route('scenario3');
  this.route('scenario4');
  this.route('scenario5');
  this.route('scenario6');
});
