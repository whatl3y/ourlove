import async from 'async'
import * as passport_facebook from 'passport-facebook'
import FacebookGraphApi from '../libs/FacebookGraphApi'
import Auth from '../libs/Auth'
import config from '../config'

const FacebookStrategy = passport_facebook.Strategy

export default function FacebookPassportStrategy(postgresClient) {
  return {
    strategy:   FacebookStrategy,
    condition:  !!config.facebook.appId,
    options: {
      clientID:           config.facebook.appId,
      clientSecret:       config.facebook.appSecret,
      callbackURL:        config.facebook.loginCallbackUrl(),
      enableProof:        true,
      passReqToCallback:  true,
      profileFields:      ["id", "emails", "name"]
    },
    handler: async function(req, accessToken, refreshToken, profile, done) {
      try {
        const auth          = new Auth({postgres:postgresClient, session:req.session})
        const fbApi         = new FacebookGraphApi(accessToken)
        const longLivedBody = await fbApi.longLivedToken(config.facebook.appId, config.facebook.appSecret)

        const intInfo = Object.assign({}, profile, {
          type:           'facebook',
          unique_id:      profile.id,
          first_name:     profile.name.givenName,
          last_name:      profile.name.familyName,
          email:          profile.emails[0].value,
          access_token:   longLivedBody.access_token || accessToken,
          refresh_token:  refreshToken,
          expires:        new Date(Date.now() + (longLivedBody.expires_in * 1000))
        })

        const userId  = await auth.findOrCreateUserAndIntegration(intInfo)
        const _       = await auth.login({id: userId, [`int_${intInfo.unique_id}`]: 'facebook', facebook: intInfo})
        return done(null, userId)

      } catch(err) {
        done(err)
      }
    }
  }
}
