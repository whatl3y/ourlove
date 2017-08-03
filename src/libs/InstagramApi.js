import request from 'request'
import async_doUntil from 'async/doUntil'
import async_retry from 'async/retry'
import ApiHandler from './ApiHandler'

const NOOP = () => {}

export default class InstagramApi extends ApiHandler {
  constructor(...args) {
    super(...args)
    this._hostname = 'api.instagram.com'
    this._host_and_protocol = `https://${this._hostname}`

    this._request = this._request.defaults({
      baseUrl: `${this._host_and_protocol}/v1`
    })
  }

  user(...args) {
    let userId = null
    let callback = null
    switch(args.length) {
      case 2:
        userId = args[0]
        callback = args[1]
        break
      case 1:
        userId = 'self'
        callback = args[0]
        break
      default:
        return new Error('No callback provided.')
    }

    const endpoint = `/users/${userId}?${this.requestBody()}`
    this._request.get({
      url: endpoint
    },this.responseFunction(callback))
  }

  userMedia(...args) {
    return new Promise((resolve, reject) => {
      const pagingType = 'user_media'
      let userId = 'self'
      let count = 100
      let minId = null
      switch(args.length) {
        case 3:
          userId = args[0]
          count = args[1]
          minId = args[2]
          break
        case 2:
          userId = args[0]
          minId = args[1]
          break
        case 1:
          userId = args[0]
          break
      }

      let additionalBody = {count: count}
      if (minId) additionalBody.min_id = minId
      let reqBody = this.requestBody(additionalBody)
      let endpoint = `/users/${userId}/media/recent?${reqBody}`
      this._request.get({
        url: endpoint
      }, this.responseFunction(pagingType, resolve, reject))
    })
  }

  tagSearch(tag,callback) {
    if (!tag) return callback(new Error('No tag provided to search for.'))
    let reqBody = this.requestBody({q:tag})
    let endpoint = `/tags/search?${reqBody}`
    this._request.get({
      url: endpoint
    },this.responseFunction(callback))
  }

  tagMedia(...args) {
    const pagingType = 'tag_media'
    let tagName = null
    let minId = null
    let count = this.defaultDataCount()
    let callback = null
    switch(args.length) {
      case 4:
        tagName = args[0]
        minId = args[1]
        count = args[2]
        callback = args[3]
        break
      case 3:
        tagName = args[0]
        minId = args[1]
        callback = args[2]
        break
      case 2:
        tagName = args[0]
        callback = args[1]
        break
      default:
        return new Error('No tag name or callback provided.')
    }

    let additionalBody = {q:tagName, count:count}
    if (minId) additionalBody.min_tag_id = minId
    let reqBody = this.requestBody(additionalBody)
    let endpoint = `/tags/${tagName}/media/recent?${reqBody}`
    this._request.get({
      url: endpoint
    },this.responseFunction(pagingType,callback))
  }

  tagMediaByCount(tagName,count,callback) {
    const self = this
    let aggregatedMedia = []
    let currentMedia
    let paginationObject = {}
    async_doUntil(function(_callback) {
      async_retry({
        times: 10,
        interval: function(retryCount) {
          return 100 * Math.pow(2, retryCount);
        }
      },
        function(__callback,previousErrorResults) {
          self.tagMedia(tagName,paginationObject.next_min_id,count,function(e,mediaData) {
            if (e) return __callback(e)
            currentMedia = mediaData
            paginationObject = currentMedia.pagination
            aggregatedMedia = aggregatedMedia.concat(currentMedia.data)
            __callback()
          })
        },
        function(err) {
          return _callback(err)
        }
      )
    },
      function() {
        return aggregatedMedia.length >= count  || !paginationObject.next_min_id //|| !currentMedia.data.length
      },
      function(err) {
        return callback(err,aggregatedMedia)
      }
    )
  }

  defaultDataCount() {
    return 100
  }

  responseFunction(...args) {
    let pagingType = null
    let callback = NOOP
    let resolve = NOOP
    let reject = NOOP
    switch(args.length) {
      case 3:
        pagingType = args[0]
        resolve = args[1]
        reject = args[2]
        break
      case 2:
        pagingType = args[0]
        callback = args[1]
        break
      case 1:
        callback = args[0]
        break
    }

    return (err, httpResponse, body) => {
      if (err) {
        reject(err)
        return callback(err)
      }
      if (httpResponse.statusCode !== 200) {
        reject(body)
        return callback(body)
      }

      const oBody = JSON.parse(body)
      if (pagingType) {
        this._paging[pagingType] = this._paging[pagingType] || {}
        this._paging[pagingType] = oBody.pagination
        resolve({body: oBody, paging: this._paging[pagingType]})
        return callback(null, oBody, this._paging[pagingType])
      }
      resolve({body: oBody})
      return callback(null, oBody)
    }
  }

  static parseImagesFromMediaResponse(response={}) {
    return response.data.map((d) => d.images)
  }
}
