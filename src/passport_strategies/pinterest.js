import async from 'async'
import * as passport_pinterest from 'passport-pinterest-oauth'
import Auth from '../libs/Auth'
import config from '../config'

const PinterestStrategy = passport_pinterest.OAuth2Strategy

module.exports = {
  BUILTIN: true,
  strategy: PinterestStrategy,
  condition: config.pinterest.appId,
  options: {
    clientID:           config.pinterest.appId,
    clientSecret:       config.pinterest.appSecret,
    callbackURL:        config.pinterest.loginCallbackUrl(),
    passReqToCallback:  true
  },
  handler: async function(req, accessToken, refreshToken, profile, done) {
    try {
      const auth = new Auth({db: config.mongodb.db, session: req.session})
      const info = {
        update: true,
        $set: {
          username: auth.getUsername(),
          pinterest: {
            id:             profile.id,
            username:       profile.username,
            name:           profile.displayName,
            access_token:   accessToken,
            expires:        null,
            refresh_token:  refreshToken,
            updated_at:     new Date()
          }
        }
      }

      const result = await auth.findOrCreateUser(info)

      req.session.user.pinterest = result.pinterest
      req.session.save()
      done(null, result.username)

    } catch(err) {
      done(err)
    }
  }
}
