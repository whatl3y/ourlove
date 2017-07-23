import async from 'async'
import * as passport_instagram from 'passport-instagram'
import Auth from '../libs/Auth'
import config from '../config'

const InstagramStrategy = passport_instagram.Strategy

export default {
  BUILTIN:    true,
  strategy:   InstagramStrategy,
  condition:  !!config.instagram.appId,
  options: {
    clientID:           config.instagram.appId,
    clientSecret:       config.instagram.appSecret,
    callbackURL:        config.instagram.loginCallbackUrl(),
    passReqToCallback:  true
  },
  handler: function(req, accessToken, refreshToken, profile, done) {
    const auth = new Auth({db:config.mongodb.db, session:req.session})
    async.waterfall([
      function(callback) {
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
        }
        auth.findOrCreateUser(info,callback)
      }
    ],
      function(err,result) {
        if (err) return done(err)

        req.session.user.instagram = result.instagram
        req.session.save()
        return done(err,result.username)
      }
    )
  }
}
