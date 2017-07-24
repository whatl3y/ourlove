import bunyan from 'bunyan'
import Auth from '../libs/Auth'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)

export default function(req, res) {
  const a = new Auth({session: req.session})
  a.logout()
  return res.redirect("/")
}
