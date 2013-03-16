/*
 * Feed and Subscription synchronizer
 *
 * Synchronizes subscriptions from Google Reader and
 * refreshes RSS/Atom feeds based on pre-configured schedule
 *
 */

var request = require('request')
  , feedManager = require('./feedManager')
  , models = require('../models');


var Synchronizer = module.exports = function() {

  feedManager.subscribe('users', function(topic, profile) {

    request.get({
      url: 'https://www.google.com/reader/api/0/subscription/list',
      qs: {
        output: 'json',
        access_token: profile.accessToken
      }
    }, function(error, res, body) {

      // Parse if string
      if(typeof(body) === 'string') {
        body = JSON.parse(body);
      }

      log.debug('Subscription Body: ', body, 'User: ', profile.id);

      // Import feeds into database
      var Feed = models.Feed;
      Feed.importFeeds(body.subscriptions);

      // Mark the user's feeds as synchronized
      var User = models.User;
      User.markFeedSynchronized({ googleId: profile.id });
    });
  });


  // TODO: Listen to the feed process channel and update items


  // TODO: Setup feed sync loop

  
};
