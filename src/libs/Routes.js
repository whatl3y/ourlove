import fs from 'fs'
import path from 'path'
import async_waterfall from 'async/waterfall'
import async_map from 'async/map'

const noop = () => {}

export default class Routes {
  constructor(options) {
    options = options || {}
    this._path = options._path || 'routes'
  }

  get(callback=noop) {
    return new Promise((resolve, reject) => {
      async_waterfall([
        _callback => fs.readdir(this._path, _callback),
        (files, _callback) => {
          files = files.filter(file => fs.lstatSync(path.join(this._path, file)).isFile())
          async_map(files, (file, __callback) => {
            const routeInfo = file.replace(/\.js/g,"").replace(/_/g,"/").replace(/\[star\]/g,"*").replace(/\[colon\]/g,":").split("..")
            const routeOrder = Number(routeInfo[0] || 0)
            const routePath = routeInfo[1]
            const routeVerb = routeInfo[2] || 'get'

            return __callback(null, {
              verb:   routeVerb,
              path:   routePath,
              order:  routeOrder,
              file:   file
            })
          }, _callback)
        }
      ],
        (err, routes) => {
          if (err) {
            reject(err)
            return callback(err)
          }

          routes = routes.sort((r1, r2) => r1.order - r2.order)
          resolve(routes)
          return callback(null, routes)
        }
      )
    })
  }

  static requireLoginExpressMiddleware(returnJsonFailure=false, failureCallback=noop) {
    return function(req, res, next) {
      if (typeof req.session.user === 'object' && req.session.user.username) return next()

      failureCallback()

      if (returnJsonFailure) return res.status(401).json({error:'Please login to access this resource.'})
      return res.redirect('/')
    }
  }

  static requireApiKeyExpressMiddleware() {
    return function(req, res, next) {
      const apiKeyProvided = req.headers['ourloveio-auth-code']
      if (!!apiKeyProvided) {
        // TODO confirm valid API key
        return next()
      }

      return res.status(401).json({error: 'Invalid authentication code.'})
    }
  }
}
