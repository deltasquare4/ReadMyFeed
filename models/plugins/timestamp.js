module.exports = function (schema, options) {
  schema.add({
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now }
  });

  schema.pre('save', function (callback) {
    this.modified_at = new Date();
    callback();
  });
};
