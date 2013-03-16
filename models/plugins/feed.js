
module.exports = function(schema, options) {
  schema.add({
    firstItemTimestamp: Number,
    lastUpdated: { type: Date, default: Date.now }
  });
};
