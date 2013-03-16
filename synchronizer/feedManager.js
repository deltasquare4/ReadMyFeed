var ascoltatori = require('ascoltatori')
  , config = require('../config');

var exports = function() {
  this.settings = {
    type: 'mongo',
    db: config.get('db:database'),
    uri: config.get('db:address'),
    pubsubCollection: 'pubsubQueue'
  };
};

exports.prototype.connect = function(callback) {
  var self = this;
  if(!this.client) {
    ascoltatori.build(this.settings, function (ascoltatore) {
      log.info('Connected to Pub/Sub.');
      self.client = ascoltatore;
      callback();
    });
  } else {
    callback();
  }
};

/*
 * Queue the user for subscription sync with Google Reader
 */
exports.prototype.queueUserForSync = function(profile) {
  var self = this;
  this.connect(function() {
    self.client.publish('users', profile, function() {
      log.debug('User ' + profile.displayName + ' added to the sync queue.');
    });
  });
};

exports.prototype.subscribe = function(channel, handler) {
  var self = this;
  this.connect(function() {
    // Listen to user sync channel and import user feeds
    self.client.subscribe(channel, handler);
  });
};

module.exports = new exports();