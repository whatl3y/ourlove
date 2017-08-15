/* Entry point for express web server
 * to listen for HTTP requests
 */

import newrelic from 'newrelic'
import http from 'http'
import https from 'https'
import os from 'os'
import url from 'url'
import fs from 'fs'
import express from 'express'
import throng from 'throng'
import session from 'express-session'
import formidable from 'express-formidable'
import ConnectRedis from 'connect-redis'
import sticky from 'sticky-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import useragent from 'express-useragent'
import redis from 'redis'
import passport from 'passport'
import path from 'path'
import bunyan from 'bunyan'
import Routes from '../libs/Routes'
import PostgresClient from '../libs/PostgresClient'
import config from '../config'

const app = express()
const pgClient = new PostgresClient()
const log = bunyan.createLogger(config.logger.options)

const isHttpsFromHostname = config.server.HOST.indexOf('https://') > -1
const isHttpsFromConfig = process.env.SECURE
let serverTypeMap = {}
if (isHttpsFromConfig) {
  const privateKey = fs.readFileSync( 'certs/server.key' )
  const certificate = fs.readFileSync( 'certs/server.crt' )
  const creds = {key:privateKey, cert:certificate}
  const httpsServer = https.Server(creds, app)
  serverTypeMap['server'] = httpsServer
} else {
  const httpServer = http.Server(app)
  serverTypeMap['server'] = httpServer
}


// entry point to enrichment apps
// throng allows for multiple processes based on
// concurrency configurations (i.e. num CPUs available.)
throng({
  workers:  config.server.CLUSTER_MAX_CPUS,
  lifetime: Infinity,
  grace:    8000,
  start:    startApp
})

async function startApp() {
  try {
    const routes = await new Routes().get()

    if (config.redis && config.redis.url) {
      //establish global redis client
      const redisUrl = url.parse(config.redis.url)
      config.redis.client = redis.createClient(redisUrl.port, redisUrl.hostname, {no_ready_check: true})
      if (redisUrl.auth) config.redis.client.auth(redisUrl.auth.split(":")[1])
    }

    //view engine setup
    app.set('views', path.join(__dirname, '..', 'views'))
    app.set('view engine', 'pug')

    app.use(useragent.express())
    app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}))
    app.use(bodyParser.json({limit: '1mb'}))
    app.use(formidable.parse())
    app.use(cookieParser(config.session.sessionSecret))

    const RedisStore = ConnectRedis(session)
    app.use(
      session({
        store:              new RedisStore({client: config.redis.client, ttl: 60 * 60 * 24 * 30}),
        secret:             config.session.sessionSecret,
        key:                config.session.sessionCookieKey,
        resave:             true,
        saveUninitialized:  true
        //cookie: { secure: true }
      })
    )
    app.use(passport.initialize())
    app.use(passport.session())

    // Enable CORS for all routes
    // app.use(function(req, res, next) {
    //   res.header("Access-Control-Allow-Origin", "*")
    //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    //   res.header("Access-Control-Max-Age", "600")
    //   next()
    // })

    //static files
    app.use('/public', express.static(path.join(__dirname, '..', '/public')))

    // initialize routes object to be used to bind express routes
    const aRoutes = fs.readdirSync('routes').filter(file => fs.lstatSync(path.join('routes', file)).isFile())
    let oRoutes = {}
    aRoutes.forEach(r => oRoutes[r] = require(path.join('..', 'routes', r)))

    //setup route handlers in the express app
    routes.forEach(route => {
      try {
        app[route.verb.toLowerCase()](route.path, oRoutes[route.file].default)
        log.debug(`Successfully bound route to express; method: ${route.verb}; path: ${route.path}`)
      } catch(err) {
        log.error(err, `Error binding route to express; method: ${route.verb}; path: ${route.path}`)
      }
    })

    //passport setup
    const strategies = fs.readdirSync("passport_strategies") || []
    strategies.forEach(stratFile => {
      try {
        const oStrat = require(`../passport_strategies/${stratFile}`).default(pgClient)
        if ((typeof oStrat.condition === 'undefined') || oStrat.condition) {
          const stratName = path.basename(stratFile, ".js")

          if (oStrat.options) return passport.use(stratName, new oStrat.strategy(oStrat.options,oStrat.handler))
          return passport.use(stratName, new oStrat.strategy(oStrat.handler))
        }

      } catch(err) {
        log.error(err)
      }
    })

    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))

    serverTypeMap['server'].listen(config.server.PORT, () => log.info(`listening on *: ${config.server.PORT}`))

  } catch(err) {
    log.error("Error starting server", err)
    process.exit()
  }

  //handle if the process suddenly stops
  process.on('SIGINT', () => {console.log('got SIGINT....'); process.exit()})
  process.on('SIGTERM', () => {console.log('got SIGTERM....'); process.exit()})
}
