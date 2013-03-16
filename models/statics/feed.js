var async = require('async')
  , _ = require('lodash');

/*
 * Statics for feed model
 */
module.exports = {
  // Import array of fields in the database
  importFeeds: function (feedlist, callback) {
    var self = this;

    async.map(feedlist, function(feed, callback) {

      var regEx = /^feed\/([\S]+)/;
      var feedUrl = regEx.exec(feed.id)[1];

      // Check if the feed already exists
      self.collection.findOne({feedUrl: feedUrl}, function(error, dbFeed) {
        if(error) { return callback(error); }

        // Add it if it doesn't exist
        if(!dbFeed) {
          var categories = _.map(feed.categories, 'label');

          dbFeed = new self({
            title: feed.title,
            feedUrl: feedUrl,
            htmlUrl: feed.htmlUrl,
            categories: categories
          });

          dbFeed.save(callback);
        } else {
          callback();
        }
      });
    }, function(error) {
      if(error) {
        log.error('Error Importing Feeds', error);
        throw error;
      }
      
      log.debug('Feeds imported successfully.');
    });
  }
};
