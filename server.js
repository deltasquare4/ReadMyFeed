var winston = require('winston')
  , http = require('http');

// Configure logs
var consoleTransport = new (winston.transports.Console)({ colorize: true, timestamp: true });
var logger = new (winston.Logger)({ transports: [ consoleTransport ] });

global.log = logger;

var app = require('./app');

// Start-up the http server
http.createServer(app).listen(app.get('port'), function(){
  log.info("Express server listening on port " + app.get('port'));
});

// Start-up the background synchronizer
var Synchronizer = require('./synchronizer');
var synchronizer = new Synchronizer();
