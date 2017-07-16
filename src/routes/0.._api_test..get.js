import moment from 'moment'
import bunyan from 'bunyan'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)

export default function Api(req, res) {
  const bodyInfo = req.body
  res.json(true)
}
