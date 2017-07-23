import path from 'path'
import moment from 'moment'
import bunyan from 'bunyan'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)

export default function Index(req, res) {
  if (req.session.returnTo)
    return res.redirect(req.session.returnTo)
  return res.redirect('/')
}
