import moment from 'moment'
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

  async create(data, path=this.path) {
    const startDate = data.startDate || data.relationship_started
    const dStartDate = (startDate) ? moment.utc(startDate).toDate() : null

    const marriedDate = data.marriedDate || data.relationship_married
    const dMarriedDate = (marriedDate) ? moment.utc(marriedDate).toDate() : null

    const params = [
      path,
      data.p1name || data.person1_name,
      data.p2name || data.person2_name,
      data.relationship_image || null,
      dStartDate,
      dMarriedDate
    ]

    const result = await this.postgres.query(`
      insert into relationships
      (path, person1_name, person2_name, relationship_primary_image, relationship_started, relationship_married)
      values
      ($1, $2, $3, $4, $5, $6)
    `, params)

    return result
  }
}
