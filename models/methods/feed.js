/*
 * Methods for feed model
 */
module.exports = {
  markAsUpdated: function () {
    feed.lastUpdated = new Date();
    feed.save();
  }
};
