
/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path');

module.exports = (function() {
  var auth = require('./middleware/authentication');
  var config = require('../config');
  var appRoot = process.cwd();

  // Authentication Middleware
  var authMiddleware = auth.getMiddleware(config);

  var app = express();
  
  // Express Middleware config
  app.configure(function(){
    // Set app-level config in express
    app.set('appRoot', appRoot);
    app.set('config', config);

    // Views
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    
    // Favicon and built-in logger
    app.use(express.favicon());
    app.use(express.logger('dev'));

    // Body parser
    app.use(express.bodyParser());

    // Cookies and session
    app.use(express.cookieParser('One big fat secret.'));
    app.use(express.session());

    // Auth and routes
    app.use(authMiddleware.initialize());
    app.use(authMiddleware.session());

    // Notification propogator
    app.use(function(req, res, next){
      if(req.method === 'GET') {
        // expose "error" and "message" to all views that are rendered.
        res.locals.error = req.session.error || undefined;
        res.locals.message = req.session.message || undefined;

        // remove them so they're not displayed on subsequent renders
        delete req.session.error;
        delete req.session.message;
      }
      next();
    });

    app.use(app.router);

    // Static files
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));

    // 404 Handler
    app.use(function(req, res, next) {
      log.error('404: Not Found: ' + req.url);
      next(new Error('404'));
    });
  });

  // Express environment config
  app.configure('test', function(){
    app.use(require('./app/middleware/errorHandler')({ dumpExceptions: true, showStack: true }));
  });

  app.configure('development', function(){
    log.exitOnError = true;
    log.transports.console.level = 'silly';
    log.transports.console.prettyPrint = true;
    log.transports.console.handleExceptions = false;

    app.use(express.errorHandler());
  });

  app.configure('production', function(){
    log.exitOnError = false;
    log.transports.console.level = 'silly';
    log.transports.console.prettyPrint = true;
    log.transports.console.handleExceptions = true;
    //log.add(log.transports.File, { filename: 'app.log', level: 'info', handleExceptions: true, timestamp: true });
  });

  // Routes
  require('./routes')(app);

  // Initialize Models
  require('../models')();

  return app;
})();

