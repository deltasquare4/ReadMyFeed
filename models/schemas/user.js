var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

// Schema declaration
var UserSchema = new Schema({
  googleId: { type: String, unique: true },
  name: { type: String, trim: true },
  profile: {},
  feedSyncStatus: { type: String, default: 'pending', enum: ['pending', 'complete'] }
}, {
  collection: 'users'
});

/*
 * Count
 *
 * Stores account information of a user
 */
module.exports = {
  name: 'User',
  schema: UserSchema,
  plugins: ['id', 'timestamp']
};

