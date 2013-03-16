/*
 * Feed and Subscription synchronizer
 *
 * Synchronizes subscriptions from Google Reader and
 * refreshes RSS/Atom feeds based on pre-configured schedule
 *
 */

var request = require('request')
  , syncManager = require('./syncManager')
  , models = require('../models');


var Synchronizer = module.exports = function() {

  syncManager.subscribe('users', function(topic, profile) {

    request.get({
      url: 'https://www.google.com/reader/api/0/subscription/list',
      qs: {
        output: 'json',
        access_token: profile.accessToken
      }
    }, function(error, res, body) {
      if(error) { throw error; }

      // Parse if string
      if(typeof(body) === 'string') {
        body = JSON.parse(body);
      }

      log.debug('Subscription Body: ', body, 'User: ', profile.id);

      // Import feeds into database
      var Feed = models.Feed;
      Feed.importFeeds(body.subscriptions, function(error, feeds) {
        if(error) { throw error; }
  
        // Mark the user's feeds as synchronized
        var User = models.User;
        User.findOne({ googleId: profile.id }, function(error, user) {
          if(error) { throw error; }
    
          user.saveFeeds(feeds);
          user.markFeedSynchronized();
        });

      });
    });
  });


  // Listen to the feed process channel and update articles
  syncManager.subscribe('feeds', function(topic, feed) {
    feedparser.parseUrl(feed.feedUrl, options, function(error, meta, articles) {
      if(error) { log.error(error); throw error; }

      // TODO: Save articles in database

    });
  });

  // TODO: Setup feed sync loop

  
};
