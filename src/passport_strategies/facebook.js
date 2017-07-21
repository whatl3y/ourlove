import async from 'async'
import * as passport_facebook from 'passport-facebook'
import FacebookGraphApi from '../libs/FacebookGraphApi'
import Auth from '../libs/Auth'
import config from '../config'

const FacebookStrategy = passport_facebook.Strategy

module.exports = {
  BUILTIN: true,
  strategy: FacebookStrategy,
  condition: config.facebook.appId,
  options: {
    clientID: config.facebook.appId,
    clientSecret: config.facebook.appSecret,
    callbackURL: config.facebook.loginCallbackUrl(),
    enableProof: true,
    passReqToCallback: true,
    profileFields: ["id", "emails", "name"]
  },
  handler: function(req, accessToken, refreshToken, profile, done) {
    var auth = new Auth({db:config.mongodb.db, session:req.session})
    async.waterfall([
      function(callback) {
        auth.findOrCreateUser({username:auth.getUsername()},function(err,user) {
          if (err) return callback(err)
          if (typeof user.facebook === 'object') {
            var tokenExpiresDate = user.facebook.expires
            if (tokenExpiresDate.getTime() > new Date().getTime()) {
              return callback(null,{
                access_token: user.facebook.access_token,
                expires: user.facebook.expires
              })
            }
          }

          var fbApi = new FacebookGraphApi(accessToken)
          fbApi.longLivedToken(config.facebook.appId, config.facebook.appSecret, callback)
        })
      },
      function(longLivedBody,callback) {
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
              expires: (longLivedBody.expires instanceof Date) ? longLivedBody.expires : new Date(Date.now() + (longLivedBody.expires * 1000)),
              refresh_token: refreshToken,
              updated_at: new Date()
            }
          }
        }
        auth.findOrCreateUser(info,callback)
      }
    ],
      function(err,result) {
        if (err) return done(err)

        req.session.user.facebook = result.facebook
        req.session.save()
        return done(null,result.username)
      }
    )
  }
}
