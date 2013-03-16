var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var model = require('../../models');

var exports = module.exports = {};

var redirectBackOrHome = function(req, res) {
  var redirectTo = req.session.redirectTo;
  delete req.session.redirectTo;

  if(redirectTo && typeof(redirectTo) === 'string') {
    res.redirect(redirectTo);
  } else {
    res.redirect('/');
  }
};


exports.getMiddleware = function(config) {

  var hostname = 'http://' + config.get('site:hostname') + ':' + config.get('site:port');

  // Google
  passport.use(new GoogleStrategy({
      clientID: config.get('auth:google:clientId'),
      clientSecret: config.get('auth:google:clientSecret'),
      callbackURL: hostname + '/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, callback) {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;

      callback(null, profile);
    }
  ));

  // Serialize user on login
  passport.serializeUser(function(user, callback) {
    callback(null, user.id);
  });

  // deserialize user on logout
  passport.deserializeUser(function(id, callback) {
    var User = model.User;
    User.findOne({ id: id }, callback);
  });

  return passport;
};

exports.logout = function(req, res, next) {
  req.logOut();
  res.redirect('/');
};

exports.google = function(req, res, next) {
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.google.com/reader/api'
    ],
    accessType: 'offline'
  })(req, res, next);
};

exports.googleCallback = function(req, res, next) {
  passport.authenticate('google', {
    failureRedirect: '/auth'
  },
  function(error, profile, info) {
    if(error) { return next(error); }

    var User = model.User;

    // Find out if the user is already registered
    User.findOne({ googleId: profile.id }, function(error, user) {
      if(error) { return next(error); }

      if(!user) {
        // User is not registered, create an account
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          profile: profile
        });

        user.save(function(error) {
          if(error) { return next(error); }

          // Establish a session
          req.logIn(user, function(error) {
            if(error) { return next(error); }

            redirectBackOrHome(req, res);
          });
        });

      } else {
        user.profile = profile;
        user.markModified('profile');

        user.save(function(error) {
          if(error) { return next(error); }

          // Establish a session
          req.logIn(user, function(error) {
            if(error) { return next(error); }

            redirectBackOrHome(req, res);
          });
        });
      }
    });
  })(req, res, next);
};

