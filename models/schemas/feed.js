var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

// Schema declaration
var FeedSchema = new Schema({
  title: String,
  feedUrl: { type: String, unique: true },
  htmlUrl: String,
  categories: [ String ]
}, {
  collection: 'feeds'
});

/*
 * Count
 *
 * Stores account information of a user
 */
module.exports = {
  name: 'Feed',
  schema: FeedSchema,
  plugins: ['id', 'feed']
};

