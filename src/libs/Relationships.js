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
    const { rows } = await this.postgres.query(`
      select * from relationships
      where path = $1
    `, [path])
    if (rows.length)
      return rows[0]
    return null
  }

  async getImages(path=this.path) {
    const { rows } = await this.postgres.query(`
      select i.* from relationships_images as i
      inner join relationships as r on r.id = i.relationships_id
      where r.path = $1
      order by image_taken, created_at
    `, [path])
    return rows
  }

  async getMilestones(path=this.path) {
    const { rows } = await this.postgres.query(`
      select
        i.main_image_name,
        i.small_image_name,
        i.tiny_image_name,
        i.orientation,
        r.person1_name,
        r.person1_birthday,
        r.person2_name,
        r.person2_birthday,
        m.*
      from relationship_milestones as m
      inner join relationships_images as i on i.id = m.image_id
      inner join relationships as r on r.id = m.relationships_id
      where r.path = $1
      order by m.milestone_time, m.created_at
    `, [path])
    return rows
  }

  async create(data, path=this.path) {
    const startDate = data.startDate || data.relationship_started
    const dStartDate = (startDate) ? moment.utc(startDate).toDate() : null

    const marriedDate = data.marriedDate || data.relationship_married
    const dMarriedDate = (marriedDate) ? moment.utc(marriedDate).toDate() : null

    const params = [
      path,
      data.user_id,
      data.p1name || data.person1_name,
      data.p2name || data.person2_name,
      dStartDate,
      dMarriedDate
    ]

    const { rows } = await this.postgres.query(`
      insert into relationships
      (path, created_user_id, person1_name, person2_name, relationship_started, relationship_married)
      values
      ($1, $2, $3, $4, $5, $6)
      returning id
    `, params)

    const relationshipId = rows[0].id
    if (relationshipId) {
      await this.postgres.query(`
        insert into users_relationships_map (user_id, relationships_id) values ($1, $2)
      `, [data.user_id, relationshipId])
    }

    return relationshipId
  }

  async update(data, path=this.path) {
    let queryAry = ['update relationships set']
    let paramsAry = []
    let paramIndTracker = 1

    Object.keys(data).forEach(key => {
      queryAry.push(`${key} = $${paramIndTracker},`)
      paramsAry.push(data[key])
      paramIndTracker++
    })

    queryAry.push('updated_at = now()')
    queryAry.push(`where path = $${paramIndTracker}`)
    paramsAry.push(path)

    const queryString = queryAry.concat(['returning id']).join(' ')
    const { rows } = await this.postgres.query(queryString, paramsAry)
    return (rows[0]) ? rows[0].id : null
  }

  async updatePicture(data, id) {
    let queryAry = ['update relationships_images set']
    let paramsAry = []
    let paramIndTracker = 1

    Object.keys(data).forEach(key => {
      queryAry.push(`${key} = $${paramIndTracker},`)
      paramsAry.push(data[key])
      paramIndTracker++
    })

    queryAry.push('updated_at = now()')
    queryAry.push(`where id = $${paramIndTracker}`)
    paramsAry.push(id)

    const queryString = queryAry.concat(['returning id']).join(' ')
    return await this.postgres.query(queryString, paramsAry)
  }

  async deletePicture(id) {
    await this.postgres.query(`delete from relationships_images where id = $1`, [id])
  }

  async updateMilestone(milestone, milestoneId=null, relationshipId=null) {
    if (milestoneId) {
      const updateableColumns = ['image_id', 'milestone_time', 'title', 'subtitle', 'description']
      let queryAry = ['update relationship_milestones set']
      let paramsAry = []
      let paramIndTracker = 1

      Object.keys(milestone).forEach(key => {
        if (updateableColumns.indexOf(key) > -1) {
          queryAry.push(`${key} = $${paramIndTracker},`)
          paramsAry.push(milestone[key])
          paramIndTracker++
        }
      })

      queryAry.push('updated_at = now()')
      queryAry.push(`where id = $${paramIndTracker}`)
      paramsAry.push(milestoneId)

      const queryString = queryAry.concat(['returning id']).join(' ')
      return await this.postgres.query(queryString, paramsAry)
    } else {
      return await this.postgres.query(`
        insert into relationship_milestones
        (relationships_id, image_id, milestone_time, title, subtitle, description)
        values
        ($1, $2, $3, $4, $5, $6)
        returning id
      `, [
        parseInt(relationshipId),
        parseInt(milestone.image_id),
        milestone.milestone_time,
        milestone.title,
        milestone.subtitle,
        milestone.description
      ])
    }
  }

  async deleteMilestone(id) {
    await this.postgres.query(`delete from relationship_milestones where id = $1`, [id])
  }
}
