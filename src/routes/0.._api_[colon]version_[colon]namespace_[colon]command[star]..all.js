import moment from 'moment'
import bunyan from 'bunyan'
import Relationships from '../libs/Relationships'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)

export default async function Api(req, res) {
  try {
    const body      = req.body
    const version   = req.params.version
    const namespace = req.params.namespace
    const command   = req.params.command
    const info      = req.params[0]

    switch(namespace) {
      case 'relationships':
        const relationship  = new Relationships({path: info})
        const record        = await relationship.getByPath()

        switch(command) {
          case 'get':
            return res.json({relationship: record})

          case 'create':
            if (record)
              return res.json({error: 'Unfortunately this relationship path has already been created.'}).status(400)

            const newRecord = body.relationship
            await relationship.create(newRecord)
            return res.sendStatus(200)
        }
        break

      case 'users':
        break
    }

    res.sendStatus(404)

  } catch(err) {
    log.error(`Error`, err)
    res.status(500).json({error: err})
  }
}
