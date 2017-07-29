import async from 'async'
import * as passport_pinterest from 'passport-pinterest-oauth'
import Auth from '../libs/Auth'
import config from '../config'

const PinterestStrategy = passport_pinterest.OAuth2Strategy

export default function PinterestPassportStrategy(postgresClient) {
  return {
    BUILTIN:  true,
    strategy:   PinterestStrategy,
    condition:  !!config.pinterest.appId,
    options: {
      clientID:           config.pinterest.appId,
      clientSecret:       config.pinterest.appSecret,
      callbackURL:        config.pinterest.loginCallbackUrl(),
      passReqToCallback:  true
    },
    handler: async function(req, accessToken, refreshToken, profile, done) {
      try {
        var auth = new Auth({postgres:postgresClient, session:req.session})
        const firstName = (profile.displayName) ? profile.displayName.split(' ')[0] : null
        const lastName = (profile.displayName) ? profile.displayName.split(' ')[1] : null

        const intInfo = Object.assign({}, profile, {
          type:           'pinterest',
          unique_id:      profile.id,
          first_name:     firstName,
          last_name:      lastName,
          access_token:   accessToken,
          refresh_token:  refreshToken,
          expires:        null
        })

        const userId  = await auth.findOrCreateUserAndIntegration(intInfo)
        const _       = await auth.login({id: userId, [`int_${intInfo.unique_id}`]: 'pinterest', pinterest: intInfo})
        return done(null, userId)

      } catch(err) {
        done(err)
      }
    }
  }
}
