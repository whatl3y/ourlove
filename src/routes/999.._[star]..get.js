import path from 'path'
import moment from 'moment'
import bunyan from 'bunyan'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)

export default function Index(req, res) {
  res.sendFile(path.resolve(`index.html`))
}
