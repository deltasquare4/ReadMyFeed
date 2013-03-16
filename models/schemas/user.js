var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

// Schema declaration
var UserSchema = new Schema({
  googleId: { type: String, unique: true },
  name: { type: String, trim: true },
  profile: {}
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
