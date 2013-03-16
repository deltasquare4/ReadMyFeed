var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// Schema declaration
var CountSchema = new Schema({
  _id: { type: String, index: true, lowercase: true, trim: true },
  count: { type: Number }
}, {
  collection: 'count'
});

/*
 * Count
 *
 * Keeps track of various numerical ids
 */
module.exports = {
  name: 'Count',
  schema: CountSchema
};

