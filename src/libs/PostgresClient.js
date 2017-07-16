import url from 'url'
import { Client, Pool } from 'pg'
import config from '../config'

const noop = () => {}

export default class PostgresClient {
  constructor(connectionConfig=config.postgres.connection_string, additionalConfig={}) {
    if (typeof connectionConfig === 'string')
      connectionConfig = this.parseConnectionString(connectionConfig)

    this.pool = new Pool({
      host:               connectionConfig.host,
      user:               connectionConfig.user,
      password:           connectionConfig.password,
      database:           connectionConfig.database,
      ssl:                connectionConfig.ssl,
      max:                additionalConfig.max || 2,    // max number of clients in the pool
      idleTimeoutMillis:  5000 // how long a client is allowed to remain idle before being closed
    })

    this.logger = additionalConfig.logger || {
      fatal:    console.log,
      critical: console.log,
      error:    console.log,
      info:     console.log,
      debug:    console.log
    }

    this.bindPoolErrorEvent()
  }

  async query(...args) {
    let query = args[0]
    let values = null
    let callback = noop
    try {
      switch (args.length) {
        case 2:
          switch (typeof args[1]) {
            case 'function':
              callback = args[1]
              break
            default:
              values = args[1] || []
          }
          break
        case 3:
          values = args[1]
          callback = args[2]
          break
      }

      let queryResults
      if (values) {
        queryResults = await this.pool.query(query, values)
      } else {
        queryResults = await this.pool.query(query)
      }

      callback(null, queryResults)
      return queryResults

    } catch (err) {
      callback(err)
      throw err
    }
  }

  bindPoolErrorEvent() {
    this.pool.on('error', (err, client) => {
      // if an error is encountered by a client while it sits idle in the pool
      // the pool itself will emit an error event with both the error and
      // the client which emitted the original error
      // this is a rare occurrence but can happen if there is a network partition
      // between your application and the database, the database restarts, etc.
      // and so you might want to handle it and at least log it out
      this.logger.error('idle client error', err.message, err.stack, client)
    })
  }

  close() {
    this.pool.end()
  }

  parseConnectionString(string, ssl=true) {
    const parsedUrl = url.parse(string)
    let config = {
      host: parsedUrl.hostname,
      database: parsedUrl.path.substring(1)
    }

    // If the connection requires auth per the URL, parse and add it
    // to the config
    const authInfo = (parsedUrl.auth) ? parsedUrl.auth.split(':') : null
    if (authInfo) {
      config.user = authInfo[0]
      config.password = authInfo[1]
      config.ssl = ssl
    }

    return config
  }
}
