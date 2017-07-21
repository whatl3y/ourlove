import path from 'path'
import moment from 'moment'
import bunyan from 'bunyan'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)

export default function Index(req, res) {
  req.session.returnTo = req.url
  req.session.save()
  res.render('index', {})
}
