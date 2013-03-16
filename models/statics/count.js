/*
 * Statics for count model
 */
module.exports = {
  getNext: function (type, callback) {
    this.collection.findAndModify({_id: type}, [['_id','asc']], {$inc: {count:1}}, {upsert: true, new: true}, function(error, result) { 
      if(error) return callback(error);

      callback(null, result.count);
    });
  }
};
