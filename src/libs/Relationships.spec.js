import assert from 'assert'
import { connect } from '../tests/_init'
import PostgresClient from './PostgresClient'
import Relationships from './Relationships'

const pgClient = new PostgresClient()

describe(`Relationships`, () => {
  before('initialize db', async () => await connect())

  it(`should create instance of class`, () => {
    const r = new Relationships({postgres: pgClient})
    assert.equal(true, r instanceof Relationships)
  })
})
