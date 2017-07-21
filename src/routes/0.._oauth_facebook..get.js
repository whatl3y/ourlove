import bunyan from 'bunyan'
import passport from 'passport'
import Routes from '../libs/Routes'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)

let additionalScopes = []
if (config.oauth_scopes instanceof Array) {
  additionalScopes = config.oauth_scopes.filter(s => s.type == 'facebook').map(s => s.scope)
  log.debug('Additional oauth_scopes found for facebook login: ' + additionalScopes.join(','))
}

export default [
  Routes.requireLoginExpressMiddleware(),
  passport.authenticate("facebook", {scope: [].concat(['email','user_photos'], additionalScopes)})
]
