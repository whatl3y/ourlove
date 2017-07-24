import Encryption from './Encryption'

const NOOP = function(){}

export default class Auth {
  constructor(options={}) {
    this.user         = options.user
    this.postgres     = options.postgres
    this._session     = options.session
    this._encryption  = new Encryption()
  }

  async findOrCreateUserAndIntegration(integrationData) {
    const intExistsType = (this._session && this._session.user) ? this._session.user[`int_${integrationData.unique_id}`] : null
    if (intExistsType && typeof this._session.user[intExistsType] === 'object')
      return this._session.user[intExistsType].user_id

    const integration = await this.getIntegration(integrationData.unique_id)
    if (integration)
      return integration.user_id

    const existingUserId = (this._session && this._session.user) ? this._session.user.id : null
    const newUserId = await this.createUserAndIntegration(existingUserId, integrationData)
    return newUserId
  }

  async getUser(id) {
    const { rows } = await this.postgres.query(`select * from users where id = $1`, [id])
    return rows[0]
  }

  async getIntegration(uniqueId) {
    const { rows } = await this.postgres.query(`select * from users_oauth_integrations where unique_id = $1`, [uniqueId])
    return (rows.length) ? rows[0] : null
  }

  async getIntegrationsFromUserId(userId) {
    const { rows } = await this.postgres.query(`select * from users_oauth_integrations where user_id = $1`, [userId])
    return (rows.length) ? rows : null
  }

  async createUserAndIntegration(userId, intInfo) {
    if (!userId) {
      const { rows } = await this.postgres.query(`insert into users (name) select $1 returning id`, [intInfo.first_name || intInfo.unique_id || 'INIT'])
      if (rows.length)
        userId = rows[0].id
      else
        throw new Error('There was a problem creating your user record.')
    }

    await this.postgres.query(`insert into users_oauth_integrations (
      user_id,
      type,
      unique_id,
      access_token,
      refresh_token,
      first_name,
      last_name,
      email,
      expires
    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
      userId, intInfo.type, intInfo.unique_id, intInfo.access_token,
      intInfo.refresh_token, intInfo.first_name, intInfo.last_name,
      intInfo.email, intInfo.expires
    ])
    return userId
  }

  login(userObject=null) {
    if (this._session) {
      this._session.user = this._session.user || {}
      userObject = userObject || this.user || this._session.user
      if (userObject) {
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
    return null
  }

  getLoggedInUsersId() {
    return this._session.user.id
  }

  isLoggedIn() {
    return !!this._session.user
  }
}
