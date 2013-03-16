/*
 * Methods for feed model
 */
module.exports = {
  markAsUpdated: function () {
    this.lastUpdated = new Date();
    this.save();
  }
};
