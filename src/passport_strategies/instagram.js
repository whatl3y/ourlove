import async from 'async'
import * as passport_instagram from 'passport-instagram'
import Auth from '../libs/Auth'
import config from '../config'

const InstagramStrategy = passport_instagram.Strategy

export default function InstagramPassportStrategy(postgresClient) {
  return {
    BUILTIN:    true,
    strategy:   InstagramStrategy,
    condition:  !!config.instagram.appId,
    options: {
      clientID:           config.instagram.appId,
      clientSecret:       config.instagram.appSecret,
      callbackURL:        config.instagram.loginCallbackUrl(),
      passReqToCallback:  true
    },
    handler: async function(req, accessToken, refreshToken, profile, done) {
      try {
        var auth = new Auth({postgres:postgresClient, session:req.session})

        const intInfo = Object.assign({}, profile, {
          type:           'instagram',
          unique_id:      profile.id,
          first_name:     profile.name.givenName,
          last_name:      profile.name.familyName,
          access_token:   accessToken,
          refresh_token:  refreshToken,
          expires:        null
        })

        const userId = await auth.findOrCreateUserAndIntegration(intInfo)
        const _       = await auth.login({id: userId, [`int_${intInfo.unique_id}`]: 'instagram', instagram: intInfo})
        return done(null, userId)

      } catch(err) {
        done(err)
      }
    }
  }
}
