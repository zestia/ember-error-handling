import Router from '@ember/routing/router';
import config from './config/environment';

const DummyRouter = Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

DummyRouter.map(function() {
  this.route('scenario1');
  this.route('scenario2');
  this.route('scenario3');
});

export default DummyRouter;
