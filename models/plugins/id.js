var model = require('../index');

module.exports = function(schema, options) {
  // Get collection name to uniquely identify count
  var name = schema.options.collection;

  schema.add({ id: { type: Number, unique: true, index: true } });

  schema.pre('save', function (callback) {
    var Count = model.Count;
    
    var self = this;
    
    if(!self.id) {
      Count.getNext(name, function(error, id) {
        if(error) return callback(error);
        
        self.id = id;
        callback();
      });
    } else {
      callback();
    }
  });
};
