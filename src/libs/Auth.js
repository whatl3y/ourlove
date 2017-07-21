import async_series from 'async/series'
import config from '../config.js'
import Encryption from './Encryption'

const NOOP = function(){}

export default class Auth {
  constructor(options) {
    // options = options || {}
    //
    // this.user = options.user
    // this._session = options.session
    // this._db = options.db || config.mongodb.db
    // this._encryption = new Encryption()
  }

  async findOrCreateUser(data, callback=NOOP) {
    // try {
    //   data = data || {}
    //   let username
    //   let upsert = false
    //   let update = false
    //   let fields = {}
    //   if (typeof data === 'string') {
    //     username = data
    //   } else {
    //     username = (data.$set) ? data.$set.username : data.username
    //     upsert = data.upsert || false
    //     update = data.update || false
    //     fields = data.fields || {}
    //     delete(data.upsert)
    //     delete(data.update)
    //   }
    //
    //   const origRecord = await this.getAccount({username: username}, fields)
    //
    //   let updatedOrNewRecord
    //   if (update || upsert)
    //     updatedOrNewRecord = await this.updateAccount({username: username}, data, {upsert: upsert})
    //
    //   let recordToReturn = origRecord
    //   this.user = origRecord
    //   if (upsert || update) {
    //     this.user = updatedOrNewRecord
    //     recordToReturn = updatedOrNewRecord
    //   }
    //
    //   if (typeof callback === 'function') callback(null, recordToReturn)
    //   return recordToReturn
    //
    // } catch(err) {
    //   if (typeof callback === 'function') callback(err)
    //   throw err
    // }
  }

  getAccount(filters={}, fields=null) {
    // return new Promise((resolve, reject) => {
    //   if (fields) {
    //     return this._db.collection("accounts").find(filters, fields).toArray((e, record) => {
    //       if (e) return reject(e)
    //       resolve((record instanceof Array) ? record[0]: record)
    //     })
    //   }
    //
    //   this._db.collection("accounts").find(filters).toArray((e, record) => {
    //     if (e) return reject(e)
    //     resolve(record)
    //   })
    // })
  }

  updateAccount(filters, data, options={}) {
    // return new Promise((resolve, reject) => {
    //   if (options) {
    //     return this._db.collection("accounts").update(filters, data, options, (e, result) => {
    //       if (e) return reject(e)
    //       if (data.$set) return resolve(data.$set)
    //       resolve(data)
    //     })
    //   }
    //
    //   this._db.collection("accounts").update(filters, data, (e, result) => {
    //     if (e) return reject(e)
    //     if (data.$set) return resolve(data.$set)
    //     resolve(data)
    //   })
    // })
  }

  async validatePassword(enteredPassword, encryptedPassword) {
    return await Encryption.comparePassword(enteredPassword, encryptedPassword)
  }

  login(userObject=null) {
    if (this._session) {
      this._session.user = this._session.user || {}
      userObject = userObject || this.user || this._session.user
      if (userObject) {
        delete(userObject._id)
        delete(userObject.password)
        for (var _key in userObject) {
          this._session.user[_key] = userObject[_key]
        }
        this._session.save()
        return true
      }
    }
    return false
  }

  logout() {
    if (this._session) {
      this._session.destroy()
      return true
    }
    return false
  }

  getUsername() {
    return (this._session && typeof this._session.user === "object") ? this._session.user.username : false
  }

  isLoggedIn() {
    return (typeof this._session.user === "object") ? !!this._session.user.username : false
  }
}

module.exports = Auth
