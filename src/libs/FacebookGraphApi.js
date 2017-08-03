import request from 'request'
import async_parallel from 'async/parallel'
import ApiHandler from './ApiHandler'

const NOOP = () => {}

export default class FacebookGraphApi extends ApiHandler {
  constructor(...args) {
    super(...args)
    this._hostname = 'graph.facebook.com'
    this._host_and_protocol = `https://${this._hostname}`
    this._default_user_fields = ['id', 'name', 'first_name', 'last_name', 'email']
    this._default_body = FacebookGraphApi.mergeObject(this._default_body,{method: 'GET'})

    this._request_with_paging = this._request
    this._request = this._request.defaults({
      baseUrl: this._host_and_protocol
    })
  }

  longLivedToken(appId, appSecret) {
    return new Promise((resolve, reject) => {
      const longLivedBody = this.requestBody({
        grant_type:         'fb_exchange_token',
        client_id:          appId,
        client_secret:      appSecret,
        fb_exchange_token:  this.access_token
      })
      const endpoint = `/oauth/access_token?${longLivedBody}`
      this._request.get({url: endpoint}, (err, httpResponse, body) => {
        if (err)
          return reject(err)
        if (httpResponse.statusCode !== 200)
          return reject(body)

        const oBody = JSON.parse(body)
        if (oBody.error) {
          if (oBody.error.code === 190) {
            const error = new Error('Token expired, need to login again')
            reject(error)
          }
        }

        resolve(oBody)
      })
    })
  }

  user(...args) {
    let userId = null
    let fields = this._default_user_fields
    let callback = null
    switch(args.length) {
      case 3:
        userId = args[0]
        fields = args[1]
        callback = args[2]
        break
      case 2:
        userId = args[0]
        callback = args[1]
        break
      case 1:
        userId = 'me'
        callback = args[0]
        break
      default:
        return new Error('No callback provided.')
    }

    const endpoint = `/${userId}`
    this._request.post({
      url: endpoint,
      body: this.requestBody({fields: this.joinGraphFields(fields)})
    },this.responseFunction(callback))
  }

  photos(...args) {
    return new Promise((resolve, reject) => {
      const pagingType = 'photos'
      let userId = 'me'
      let type = 'tagged' // 'tagged' or 'uploaded'
      let nextPageUrl = null
      switch(args.length) {
        case 3:
          userId = args[0]
          type = args[1]
          nextPageUrl = args[2]
          break
        case 2:
          userId = args[0]
          type = args[1]
          break
        case 1:
          userId = args[0]
          break
      }

      let _r = this._request
      let endpoint = `/${userId}/photos?type=${type}`
      if (nextPageUrl || (this._paging[pagingType] && this._paging[pagingType].next)) {
        nextPageUrl = nextPageUrl || this._paging[pagingType].next
        endpoint = nextPageUrl
        _r = this._request_with_paging
      }
      _r.post({
        url: endpoint,
        body: this.requestBody({fields: this.joinGraphFields(this.photoFields())})
      }, this.responseFunction(pagingType, resolve, reject))
    })
  }

  userGroups(...args) {
    const pagingType = 'userGroups'
    let userId = null
    let callback = null
    switch(args.length) {
      case 2:
        userId = args[0]
        callback = args[1]
        break
      case 1:
        userId = 'me'
        callback = args[0]
        break
      default:
        return new Error('No callback provided.')
    }

    let _r = this._request
    let endpoint = `/${userId}/groups`
    if (this._paging[pagingType] && this._paging[pagingType].next) {
      endpoint = this._paging[pagingType].next
      _r = this._request_with_paging
    }
    _r.get({
      url: endpoint,
      body: this.requestBody()
    },this.responseFunction(pagingType,callback))
  }

  userAlbums(...args) {
    const pagingType = 'albums'
    const fields = this.albumGraphFields()
    let userId = null
    let callback = null
    switch(args.length) {
      case 2:
        userId = args[0]
        callback = args[1]
        break
      case 1:
        userId = 'me'
        callback = args[0]
        break
      default:
        return new Error('No callback provided.')
    }

    let _r = this._request
    let endpoint = `/${userId}/albums`
    if (this._paging[pagingType] && this._paging[pagingType].next) {
      endpoint = this._paging[pagingType].next
      _r = this._request_with_paging
    }
    _r.post({
      url: endpoint,
      body: this.requestBody({fields: this.joinGraphFields(fields)})
    },this.responseFunction(pagingType,callback))
  }

  album(...args) {
    let albumId = null
    let fields = null
    let callback = null
    switch(args.length) {
      case 3:
        albumId = args[0]
        fields = args[1]
        callback = args[2]
        break
      case 2:
        albumId = args[0]
        fields = this.albumGraphFields()
        callback = args[1]
        break
      default:
        return new Error('No callback provided.')
    }

    let endpoint = `/${albumId}`
    this._request.post({
      url: endpoint,
      body: this.requestBody({fields: this.joinGraphFields(fields)})
    },this.responseFunction(callback))
  }

  albumPhotos(...args) {
    let albumId = null
    let callback = null
    switch(args.length) {
      case 2:
        albumId = args[0]
        callback = args[1]
        break
      default:
        return new Error('No callback provided.')
    }

    let _r = this._request
    const pagingType = `album_photos_${albumId}`
    let endpoint = `/${albumId}/photos`
    if (this._paging[pagingType] && this._paging[pagingType].next) {
      endpoint = this._paging[pagingType].next
      _r = this._request_with_paging
    }
    _r.post({
      url: endpoint,
      body: this.requestBody({fields: this.joinGraphFields(this.photoFields())})
    },this.responseFunction(pagingType,callback))
  }

  albumAndPhotos(albumId,callback) {
    const self = this
    async_parallel([
      function(_callback) {
        self.album(albumId,_callback)
      },
      function(_callback) {
        self.albumPhotos(albumId,_callback)
      }
    ],
      function(err,results) {
        if (err) return callback(err)

        let album = results[0]
        let albumPhotos = results[1]
        album.photos = albumPhotos.data
        return callback(null,album)
      }
    )
  }

  groupFeed(groupId, callback) {
    const pagingType = 'group'
    const fields = this.feedGraphFields()
    const endpoint = `/${groupId}/feed`
    this._request.get({
      url: endpoint,
      body: this.requestBody({fields: this.joinGraphFields(fields)})
    },this.responseFunction(callback))
  }

  revokeAccess(...args) {
    let userId = null
    let callback = null
    switch(args.length) {
      case 2:
        userId = args[0]
        callback = args[1]
        break
      case 1:
        userId = 'me'
        callback = args[0]
        break
      default:
        return new Error('No callback provided.')
    }

    const endpoint = `/${userId}/permissions`
    this._request.delete({
      url: endpoint,
      body: this.requestBody()
    },this.responseFunction(callback))
  }

  albumGraphFields(extraFields=[]) {
    return [
      'id',
      'count',
      {'cover_photo': this.photoFields()},
      'created_time',
      'description',
      'from',
      'link',
      'name',
      'location',
      'type'
    ].concat(extraFields)
  }

  photoFields(extraFields=[]) {
    return [
      'id',
      'images',
      'icon',
      'name',
      'picture',
      'place',
      'created_time',
      'updated_time',
      'from',
      'name_tags'
    ].concat(extraFields)
  }

  feedGraphFields(extraFields=[]) {
    // from{link,name},id,message,updated_time,link
    return [
      'id',
      'message',
      'updated_time',
      'link',
      {from: ['name', 'link']}
    ].concat(extraFields)
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
        if (typeof oBody.paging === 'object') {
          this._paging[pagingType].previous = oBody.paging.previous
          this._paging[pagingType].next = oBody.paging.next
        } else {
          delete(this._paging[pagingType].previous)
          delete(this._paging[pagingType].next)
        }
        resolve({body: oBody, paging: this._paging[pagingType].next})
        return callback(null, oBody, this._paging[pagingType].next)
      }
      resolve({body: oBody})
      return callback(null, oBody)
    }
  }

  joinGraphFields(fieldArray) {
    for (const _key in fieldArray) {
      if (typeof fieldArray[_key] === 'object') {
        const __key = Object.keys(fieldArray[_key])[0]
        fieldArray[_key] = __key + '{' + this.joinGraphFields(fieldArray[_key][__key]) + '}'
      }
    }
    return fieldArray.join()
  }
}
