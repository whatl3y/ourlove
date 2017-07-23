'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _passportFacebook = require('passport-facebook');

var passport_facebook = _interopRequireWildcard(_passportFacebook);

var _FacebookGraphApi = require('../libs/FacebookGraphApi');

var _FacebookGraphApi2 = _interopRequireDefault(_FacebookGraphApi);

var _Auth = require('../libs/Auth');

var _Auth2 = _interopRequireDefault(_Auth);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FacebookStrategy = passport_facebook.Strategy;

exports.default = {
  BUILTIN: true,
  strategy: FacebookStrategy,
  condition: _config2.default.facebook.appId,
  options: {
    clientID: _config2.default.facebook.appId,
    clientSecret: _config2.default.facebook.appSecret,
    callbackURL: _config2.default.facebook.loginCallbackUrl(),
    enableProof: true,
    passReqToCallback: true,
    profileFields: ["id", "emails", "name"]
  },
  handler: function (req, accessToken, refreshToken, profile, done) {
    var auth = new _Auth2.default({ db: _config2.default.mongodb.db, session: req.session });
    _async2.default.waterfall([function (callback) {
      auth.findOrCreateUser({ username: auth.getUsername() }, function (err, user) {
        if (err) return callback(err);
        if (typeof user.facebook === 'object') {
          var tokenExpiresDate = user.facebook.expires;
          if (tokenExpiresDate.getTime() > new Date().getTime()) {
            return callback(null, {
              access_token: user.facebook.access_token,
              expires: user.facebook.expires
            });
          }
        }

        var fbApi = new _FacebookGraphApi2.default(accessToken);
        fbApi.longLivedToken(_config2.default.facebook.appId, _config2.default.facebook.appSecret, callback);
      });
    }, function (longLivedBody, callback) {
      var info = {
        update: true,
        $set: {
          username: auth.getUsername(),
          facebook: {
            id: profile.id,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            access_token: longLivedBody.access_token,
            expires: longLivedBody.expires instanceof Date ? longLivedBody.expires : new Date(Date.now() + longLivedBody.expires * 1000),
            refresh_token: refreshToken,
            updated_at: new Date()
          }
        }
      };
      auth.findOrCreateUser(info, callback);
    }], function (err, result) {
      if (err) return done(err);

      req.session.user.facebook = result.facebook;
      req.session.save();
      return done(null, result.username);
    });
  }
};