/**
 * models/index
 *
 * Loop through all the models and make sure they are initialized in
 * the database. Then create a connection to Mongo.
 *
 */
var mongoose = require("mongoose")
  , config = require("../config")
  , fileutils = require('../lib/fileutils');

/**
 * Model initialization function when you call require('./models)()
 */
module.exports = exports = function() {
  // Export models
  exports.models = {};
 
  // Make models accessible through model.<ModelName>
  exports.__proto__ = exports.models;
 
  var files = fs.readdirSync('./models/schemas');
 
  // Connect to the database
  log.info('Connecting to MongoDB.');
  mongoose.connect(config.dbUri);
 
  mongoose.connection.on('open', function() {
    log.info('MongoDB connection established.');
  });
  mongoose.connection.on('error', function(error) {
    log.error('Could not establish connection.');
    throw error;
  });
 
  // Require and cache the models
  for (var i = files.length - 1; i >= 0; i--) {
    var modelFilename = files[i];
    exports.initializeModel(modelFilename);
  }
};

/**
 * Initialize one model
 * @param schemaFile The name of the model file (ex. user.js)
 */
exports.initializeModel = function(modelFilename) {

  // load the schema and model
  var config = fileutils.require(['models', 'schemas', modelFilename]);

  var modelName = config.name
    , schema = config.schema;

  if(config.plugins) {
    this.loadPlugins(schema, config.plugins);
  }

  this.loadMethods(schema, modelName);
  this.loadStatics(schema, modelName);

  // local the mongoose model and cache it in the exports models
  exports.models[modelName] = mongoose.model(modelName, schema);
};

exports.loadPlugins = function(schema, plugins) {

  for (var i = plugins.length - 1; i >= 0; i--) {    
    var plugin = fileutils.require(['models', 'plugins', plugins[i]]);

    if(!plugin) {
      throw new Error('Invalid Plugin');
    }

    schema.plugin(plugin);
  }
};

exports.loadMethods = function(schema, modelName) {
  var methods = fileutils.require(['model', 'methods', modelName], false);
  if(methods) {
    var methodNames = _.keys(methods);

    if(methodNames.length === 0) {
      return;
    }

    for (var i = methodNames.length - 1; i >= 0; i--) {
      var methodName = methodNames[i];
      schema.methods[methodName] = methods[methodName];
    }
  }
};

exports.loadStatics = function(schema, modelName) {
  var statics = fileutils.require(['model', 'statics', modelName], false);
  if(statics) {
    var staticNames = _.keys(statics);

    if(staticNames.length === 0) {
      return;
    }

    for (var i = staticNames.length - 1; i >= 0; i--) {
      var staticName = staticNames[i];
      schema.statics[staticName] = statics[staticName];
    }
  }

};
