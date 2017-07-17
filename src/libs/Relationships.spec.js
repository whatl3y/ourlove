import assert from 'assert'
import { connect } from '../tests/_init'
import Relationships from './Relationships'

describe(`Relationships`, () => {
  before('initialize db', async () => await connect())

  it(`should create instance of class`, () => {
    const r = new Relationships()
    assert.equal(true, r instanceof Relationships)
  })
})
