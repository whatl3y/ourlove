import PostgresClient from './PostgresClient'

export default class Relationships {
  constructor(options={}) {
    this.id       = options.id
    this.path     = options.path
    this.postgres = options.postgres || new PostgresClient()
  }

  async get(id=this.id) {
    const records = await this.postgres.query(`
      select * from relationships
      where id = $1
    `, [id])
    if (records && records.rows.length)
      return records.rows[0]
    return null
  }

  async getByPath(path=this.path) {
    const records = await this.postgres.query(`
      select * from relationships
      where path = $1
    `, [path])
    if (records && records.rows.length)
      return records.rows[0]
    return null
  }
}
