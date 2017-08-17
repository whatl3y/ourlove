import moment from 'moment'
import PostgresClient from './PostgresClient'

export default class Relationships {
  constructor(options={}) {
    this.id       = options.id
    this.path     = options.path
    this.postgres = options.postgres || new PostgresClient()
  }

  async getOpenPageFromNames(name1, name2, attempt=0) {
    let pathToTry = `/${name1.toLowerCase()}and${name2.toLowerCase()}`
    if (attempt > 0)
      pathToTry += attempt

    const { rows } = await this.postgres.query('select * from relationships where path = $1', [pathToTry])
    if (rows.length > 0)
      return await this.getOpenPageFromNames(name1, name2, attempt+1)

    return pathToTry
  }

  async getRelationshipsByColumn(orderByColumnAndDirection, limit=10, offset=0) {
    const column = Object.keys(orderByColumnAndDirection)[0]
    const direction = orderByColumnAndDirection[column] || 'desc'
    const { rows } = await this.postgres.query(`
      select i.main_image_name, i.small_image_name, r.* from relationships as r
      left outer join relationships_images as i on i.relationships_id = r.id and i.relationship_primary_image is true
      order by r.${column} ${direction}
      limit ${limit}
      offset ${offset}
    `)
    return rows
  }

  async getRelationshipsByUserId(userId) {
    const { rows } = await this.postgres.query(`
      select i.main_image_name, i.small_image_name, r.* from users_relationships_map as m
      inner join relationships as r on r.id = m.relationships_id
      left outer join relationships_images as i on i.relationships_id = r.id and i.relationship_primary_image is true
      where m.user_id = $1
    `, [userId])
    return rows
  }

  async get(id=this.id) {
    const { rows } = await this.postgres.query(`
      select * from relationships
      where id = $1
    `, [id])
    if (rows.length)
      return rows[0]
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

  async getAdminUsersByPath(path=this.path) {
    const { rows } = await this.postgres.query(`
      select u.* from users_relationships_map as m
      inner join users as u on u.id = m.user_id
      inner join relationships as r on r.id = m.relationships_id
      where r.path = $1
    `, [path])
    return rows
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
      inner join relationships as r on r.id = m.relationships_id
      left outer join relationships_images as i on i.id = m.image_id
      where r.path = $1
      order by m.milestone_time desc, m.created_at desc
    `, [path])
    return rows
  }

  async getReminders(path=this.path) {
    const { rows } = await this.postgres.query(`
      select m.title, m.milestone_time, r.relationship_started, r.relationship_married, rem.* from relationship_reminders as rem
      inner join relationships as r on r.id = rem.relationships_id
      left outer join relationship_milestones as m on m.id = rem.milestone_id
      where r.path = $1
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
    let results
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
      results = await this.postgres.query(queryString, paramsAry)
    } else {
      results = await this.postgres.query(`
        insert into relationship_milestones
        (relationships_id, image_id, milestone_time, title, subtitle, description)
        values
        ($1, $2, $3, $4, $5, $6)
        returning id
      `, [
        parseInt(relationshipId),
        (milestone.image_id) ? parseInt(milestone.image_id) : null,
        milestone.milestone_time,
        milestone.title,
        milestone.subtitle,
        milestone.description
      ])
    }

    if (results && results.rows.length > 0) return results.rows[0].id
    return null
  }

  async deleteMilestone(id) {
    await this.postgres.query(`delete from relationship_milestones where id = $1`, [id])
  }

  async updateReminder(reminder, reminderId=null, relationshipId=null) {
    let results
    if (reminderId) {
      const updateableColumns = ['relationships_id', 'milestone_id', 'reminder_type', 'days_before_milestone_to_remind', 'emails', 'is_active']
      let queryAry = ['update relationship_reminders set']
      let paramsAry = []
      let paramIndTracker = 1

      Object.keys(reminder).forEach(key => {
        if (updateableColumns.indexOf(key) > -1) {
          queryAry.push(`${key} = $${paramIndTracker},`)
          paramsAry.push(reminder[key])
          paramIndTracker++
        }
      })

      queryAry.push('updated_at = now()')
      queryAry.push(`where id = $${paramIndTracker}`)
      paramsAry.push(reminderId)

      const queryString = queryAry.concat(['returning id']).join(' ')
      results = await this.postgres.query(queryString, paramsAry)
    } else {
      results = await this.postgres.query(`
        insert into relationship_reminders
        (relationships_id, milestone_id, reminder_type, days_before_milestone_to_remind, emails, is_active)
        values
        ($1, $2, $3, $4, $5, $6)
        returning id
      `, [
        parseInt(relationshipId),
        (reminder.milestone_id) ? parseInt(reminder.milestone_id) : null,
        reminder.reminder_type,
        reminder.days_before_milestone_to_remind,
        reminder.emails,
        true
      ])
    }

    if (results && results.rows.length > 0) return results.rows[0].id
    return null
  }

  async deleteReminder(id) {
    await this.postgres.query(`delete from relationship_reminders where id = $1`, [id])
  }
}
