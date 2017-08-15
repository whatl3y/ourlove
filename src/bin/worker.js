import minimist from 'minimist'
import url from 'url'
import async from 'async'
import redis from 'redis'
import resque from 'node-resque'
import throng from 'throng'
import bunyan from 'bunyan'
import config from '../config'

const argv = minimist(process.argv.slice(2))
const log = bunyan.createLogger(config.logger.options)

const queues = argv.q || argv.queue || argv.queues || 'default'
const queuesAry = queues.split(',')

const redisUrl = url.parse(config.redis.url)
const redisPlainClient = redis.createClient(redisUrl.port, redisUrl.hostname, {no_ready_check: true})
if (redisUrl.auth)
  redisPlainClient.auth(redisUrl.auth.split(":")[1])

const connectionDetails = {redis: redisPlainClient}

// entry point to workers
throng({
  workers:  config.server.CLUSTER_MAX_CPUS,
  lifetime: Infinity,
  grace:    15000,
  start:    startApp
})

function startApp() {
  const jobs = {
    sendEmail: {
      plugins: [ 'retry' ],
      pluginOptions: {
        retry: {
          retryLimit: 5,
          retryDelay: (1000 * 5),
        }
      },
      perform: async (to, subject, body, callback) => {
        try {
          // await mosaicJobHelpers.buildMosaicJob(id, gridSize, mosaicPixelWidth, {method: 'createWorkerOverlay', mosaic_type: 'overlay'})
          callback(null, 'success!')
        } catch(err) {
          callback(err)
        }
      }
    }
  }

  const multiWorker = new resque.multiWorker({
    connection:          connectionDetails,
    queues:              queuesAry,
    minTaskProcessors:   1,
    maxTaskProcessors:   100,
    checkTimeout:        1000,
    maxEventLoopDelay:   10,
    toDisconnectProcessors: true,
  }, jobs)

  multiWorker.start()

  const scheduler = new resque.scheduler({connection: connectionDetails})
  scheduler.connect(() => scheduler.start())

  multiWorker.on('start',           (workerId) => log.debug("worker["+workerId+"] started"))
  multiWorker.on('end',             (workerId) => log.info("worker["+workerId+"] ended"))
  multiWorker.on('cleaning_worker', (workerId, worker, pid) => log.debug("cleaning old worker " + worker))
  // NOISY
  // multiWorker.on('poll',            (workerId, queue) => log.debug("worker["+workerId+"] polling " + queue))
  multiWorker.on('job',             (workerId, queue, job) => log.info("worker["+workerId+"] working job " + queue + " " + printObject(job)))
  multiWorker.on('reEnqueue',       (workerId, queue, job, plugin) => log.info("worker["+workerId+"] reEnqueue job (" + printObject(plugin) + ") " + queue + " " + printObject(job)))
  multiWorker.on('success',         (workerId, queue, job, result) => log.info("worker["+workerId+"] job success " + queue + " " + printObject(job) + " >> " + printObject(result)))
  multiWorker.on('failure',         (workerId, queue, job, failure) => log.error("worker["+workerId+"] job failure " + queue + " " + printObject(job) + " >> " + printObject(failure)))
  multiWorker.on('error',           (workerId, queue, job, error) => log.error("worker["+workerId+"] error " + queue + " " + printObject(job) + " >> " + printObject(error)))
  // NOISY
  // multiWorker.on('pause',           (workerId) => log.debug("worker["+workerId+"] paused"))

  // multiWorker emitters
  multiWorker.on('internalError',     (error) => log.error(error))
  // NOISY
  // multiWorker.on('multiWorkerAction', (verb, delay) => log.debug("*** checked for worker status: " + verb + " (event loop delay: " + delay + "ms)"))

  scheduler.on('start',             function(){ log.debug("scheduler started") })
  scheduler.on('end',               function(){ log.info("scheduler ended") })
  scheduler.on('poll',              function(){ log.debug("scheduler polling") })
  scheduler.on('master',            function(state){ log.info("scheduler became master") })
  scheduler.on('error',             function(error){ log.error("scheduler error >> " + printObject(error)) })
  scheduler.on('working_timestamp', function(timestamp){ log.info("scheduler working timestamp " + timestamp) })
  scheduler.on('transferred_job',   function(timestamp, job){ log.info("scheduler enquing job " + timestamp + " >> " + printObject(job)) })

  process.on('SIGINT', killProcess)
  process.on('SIGTERM', killProcess)

  function killProcess() {
    multiWorker.workers.forEach((worker) => worker.workerCleanup())
    async.parallel([
      callback => multiWorker.end(callback),
      callback => scheduler.end(callback)
    ],
      (err, results) => {
        if (err) log.error(err)
        log.info('Shut down worker')
        process.exit()
      }
    )
  }

  function printObject(obj) {
    if (!obj)
      return 'N/A'

    if ({}.toString.call(obj) == "[object Object]")
      return JSON.stringify(obj)

    return obj.toString()
  }
}
