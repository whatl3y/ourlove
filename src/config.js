var self = module.exports = {
  app: {
    name: process.env.APP_NAME || "ourlove"
  },

  server: {
    PORT:             process.env.PORT || 8000,
    CLUSTERING:       process.env.CLUSTERING || false,
    CLUSTER_MAX_CPUS: process.env.CLUSTER_MAX_CPUS || process.env.WEB_CONCURRENCY || 1,
    IS_PRODUCTION:    process.env.IS_PRODUCTION || false,
    HOST:             process.env.HOSTNAME || "http://localhost:8080"
  },

  socketio: {},

  newrelic: {
    key:    process.env.NEWRELIC_KEY || process.env.NEW_RELIC_LICENSE_KEY,
    level:  process.env.NEWRELIC_LEVEL || 'info'
  },

  heroku: {
    name:           process.env.APP_NAME || "useriq_bigdata_stream",
    internal_name:  process.env.HEROKU_APP_NAME || "useriq-bigdata-stream",
    api_key:        process.env.HEROKU_API_KEY
  },

  aws: {
    access_key:         process.env.AWS_ACCESS_KEY_ID,
    access_secret:      process.env.AWS_SECRET_ACCESS_KEY,
    uiq_access_key:     process.env.UIQ_AWS_ACCESS_KEY_ID,
    uiq_access_secret:  process.env.UIQ_AWS_SECRET_ACCESS_KEY,

    s3: {
      bucket: process.env.AWS_S3_BUCKET || 'our.love'
    }
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },

  postgres: {
    connection_string: process.env.DATABASE_URL || 'postgres://localhost:5432',
    readonly_connection_string: process.env.ANALYTICS_DATABASE_URL || process.env.DATABASE_URL || 'postgres://localhost:5432',
    maxClientsLarge: parseInt(process.env.POSTGRES_LARGE_MAX_CLIENTS || 10),
    maxClientsSmall: parseInt(process.env.POSTGRES_SMALL_MAX_CLIENTS || 2)
  },

  cryptography: {
    algorithm: "aes-256-ctr",
    password: process.env.CRYPT_SECRET
  },

  logger: {
    options: {
      name: process.env.APP_NAME || "ourlove",
      level: process.env.LOGGING_LEVEL || "info",
      stream: process.stdout
      /*streams: [
        {
          level: process.env.LOGGING_LEVEL || "info",
          path: path.join(__dirname,"..","logs","wiki.log")
        }
      ]*/
    }
  }
}
