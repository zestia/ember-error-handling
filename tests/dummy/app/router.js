import Router from '@ember/routing/router';
import config from './config/environment';

const DummyRouter = Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

DummyRouter.map(function() {
  this.route('test1');
  this.route('test2');
  this.route('test3');
});

export default DummyRouter;
