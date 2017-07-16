import Heroku from 'heroku-client'
import bunyan from 'bunyan'
import config from '../config'

export default class HerokuClient {
  constructor(options={}) {
    this._log = options.logger || bunyan.createLogger(config.logger.options)
    this.app_name = options.app || config.heroku.internal_name
    this._heroku = new Heroku({ token: options.api_key || config.heroku.api_key })
  }

  async getCurrentDynosByType(dynoType) {
    const allDynos = await this._heroku.get(`/apps/${self.app_name}/dynos`)
    const desiredDynoTypes = allDynos.filter(d => d.type == dynoType)
    return desiredDynoTypes
  }

  updateDynoFormation(dynoType, options={}) {
    const number = options.number
    const size = options.size || 'standard-1X'
    return this._heroku.patch(`/apps/${this.app_name}/formation/${dynoType}`,{
      body: {
        quantity: number,
        size: size
      }
    })
  }

  getAddOns() {
    return this._heroku.get(`/apps/${this.app_name}/addons`)
  }

  getAddOnInfo(nameOrId) {
    return this._heroku.get(`/apps/${this.app_name}/addons/${nameOrId}`)
  }

  updateAddOn(nameOrId, newPlan) {
    return this._heroku.patch(`/apps/${this.app_name}/addons/${nameOrId}`, {
      body: {
        plan: newPlan
      }
    })
  }
}
