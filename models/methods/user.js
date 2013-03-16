var models = require('../index');

/*
 * Methods for count model
 */
module.exports = {

  // Mark the user as synchronized with Reader
  markFeedSynchronized: function () {
    var user = this;

    user.feedSyncStatus = 'complete';
    user.save();
  },

  saveFeeds: function(feedIds) {
    var user = this;
    var Feed = models.Feed;

    Feed.find()
      .where('id').in(feedIds)
      .exec(function(error, feeds) {
        if(error) { log.error("Error saving feeds", error); throw error; }

        if(!user.feeds instanceof Array) {
          user.feeds = [];
        }
        if(!feeds instanceof Array) {
          user.feeds = [];
        }

        user.feeds = user.feeds.concat(feeds);
        user.markModified('feeds');

        user.save();
      });
  }
};
