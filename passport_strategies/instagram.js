'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _passportInstagram = require('passport-instagram');

var passport_instagram = _interopRequireWildcard(_passportInstagram);

var _Auth = require('../libs/Auth');

var _Auth2 = _interopRequireDefault(_Auth);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const InstagramStrategy = passport_instagram.Strategy;

exports.default = {
  BUILTIN: true,
  strategy: InstagramStrategy,
  condition: _config2.default.instagram.appId,
  options: {
    clientID: _config2.default.instagram.appId,
    clientSecret: _config2.default.instagram.appSecret,
    callbackURL: _config2.default.instagram.loginCallbackUrl(),
    passReqToCallback: true
  },
  handler: function (req, accessToken, refreshToken, profile, done) {
    const auth = new _Auth2.default({ db: _config2.default.mongodb.db, session: req.session });
    _async2.default.waterfall([function (callback) {
      var info = {
        update: true,
        $set: {
          username: auth.getUsername(),
          instagram: {
            id: profile.id,
            username: profile.username,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            access_token: accessToken,
            expires: null,
            refresh_token: refreshToken,
            updated_at: new Date()
          }
        }
      };
      auth.findOrCreateUser(info, callback);
    }], function (err, result) {
      if (err) return done(err);

      req.session.user.instagram = result.instagram;
      req.session.save();
      return done(err, result.username);
    });
  }
};