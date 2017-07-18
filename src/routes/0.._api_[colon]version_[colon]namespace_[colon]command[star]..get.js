import moment from 'moment'
import bunyan from 'bunyan'
import Relationships from '../libs/Relationships'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)

export default async function Api(req, res) {
  try {
    const version   = req.params.version
    const namespace = req.params.namespace
    const command   = req.params.command
    const info      = req.params[0]

    switch(namespace) {
      case 'relationships':
        switch(command) {
          case 'get':
            const relationship  = new Relationships({path: info})
            const record        = await relationship.getByPath()
            return res.json({relationship: record})
        }
        break

      case 'users':
        break
    }

    res.sendStatus(404)

  } catch(err) {
    log.error(`Error`, err)
    res.json({error: err}).status(500)
  }
}
