/*
 * Statics for count model
 */
module.exports = {
  markFeedSynchronized: function (query) {
    var self = this;

    self.findOne(query, function(error, user) {
      if(error) { throw error; }

      if(!user) { throw new Error('No matching user'); }

      user.feedSyncStatus = 'complete';
      user.save();
    });
  }
};
