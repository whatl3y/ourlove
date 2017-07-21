import url from 'url'
import { Pool } from 'pg'
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
  }

  async query(query, values=null) {
    if (values) {
      return await this.pool.query(query, values)
    } else {
      return await this.pool.query(query)
    }
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
