'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _passportPinterestOauth = require('passport-pinterest-oauth');

var passport_pinterest = _interopRequireWildcard(_passportPinterestOauth);

var _Auth = require('../libs/Auth');

var _Auth2 = _interopRequireDefault(_Auth);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const PinterestStrategy = passport_pinterest.OAuth2Strategy;

exports.default = {
  BUILTIN: true,
  strategy: PinterestStrategy,
  condition: _config2.default.pinterest.appId,
  options: {
    clientID: _config2.default.pinterest.appId,
    clientSecret: _config2.default.pinterest.appSecret,
    callbackURL: _config2.default.pinterest.loginCallbackUrl(),
    passReqToCallback: true
  },
  handler: (() => {
    var _ref = _asyncToGenerator(function* (req, accessToken, refreshToken, profile, done) {
      try {
        const auth = new _Auth2.default({ db: _config2.default.mongodb.db, session: req.session });
        const info = {
          update: true,
          $set: {
            username: auth.getUsername(),
            pinterest: {
              id: profile.id,
              username: profile.username,
              name: profile.displayName,
              access_token: accessToken,
              expires: null,
              refresh_token: refreshToken,
              updated_at: new Date()
            }
          }
        };

        const result = yield auth.findOrCreateUser(info);

        req.session.user.pinterest = result.pinterest;
        req.session.save();
        done(null, result.username);
      } catch (err) {
        done(err);
      }
    });

    return function handler(_x, _x2, _x3, _x4, _x5) {
      return _ref.apply(this, arguments);
    };
  })()
};