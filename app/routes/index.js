
var fs = require('fs')
  , fileutils = require('../../lib/fileutils')
  , auth = require('../middleware/authentication');

var exports = module.exports = function(app) {
  exports.routes = {};

  var files = fs.readdirSync('./app/routes');
  var regEx = /^([a-z0-9A-Z\-\_]+).routes.js$/;

  for (var i = files.length - 1; i >= 0; i--) {
    var filename = files[i];

    if(regEx.test(filename)) {
      var route = regEx.exec(filename)[1];
      exports.routes[route] = fileutils.require(['app', 'routes', filename]);
    }
  }


  // Interceptors
  app.all('/*', function(req, res, next) {

    if(req.isAuthenticated()) {
      res.locals.isLoggedIn = true;
      res.locals.user = req.user;
    } else {
      res.locals.isLoggedIn = false;
    }

    next();
  });


  // Routes
  var main = exports.routes.main;
  app.get('/', main.home);

  app.get('/auth/google', auth.google);
  app.get('/auth/google/callback', auth.googleCallback);
  app.get('/logout', auth.logout);

};
