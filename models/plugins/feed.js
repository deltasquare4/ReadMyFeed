
module.exports = function(schema, options) {
  schema.add({
    firstItemTimestamp: Number,
    lastUpdated: { type: Date, default: Date.now }
  });

  schema.pre('save', function (callback) {
    this.lastUpdated = new Date();
    callback();
  });
};
