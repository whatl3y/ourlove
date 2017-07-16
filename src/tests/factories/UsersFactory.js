import { connect } from '../_init.js'

export const UsersFactory = {
  async insert1(shouldTruncate=true) {
    const postgres = await connect(shouldTruncate)
    await postgres.query(`
      insert into users
      (username)
      values
      ('lance')
    `)
    return postgres
  }
}
