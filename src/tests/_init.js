import path from 'path'
import child_process from 'child_process'
import PostgresClient from '../libs/PostgresClient'

const fork = child_process.fork
const postgres_url = process.env.DATABASE_URL || 'postgres://localhost:5432/ourlove_test'
const noop = () => {}

const postgres = new PostgresClient(postgres_url, {max: 1})

export async function connect(shouldTruncate=true) {
  await _init(postgres, shouldTruncate)
  return postgres
}

async function _init(postgres, shouldTruncate) {
  await new Promise((resolve, reject) => {
    const dbMigrationProcess = fork(path.join('.', 'tasks', 'migrations'), [])
    let callbackCalled = false
    const eventCallback = done => {
      return info => {
        if (callbackCalled) return

        callbackCalled = true
        if (info instanceof Error)
          return done(info)
        done()
      }
    }
    dbMigrationProcess.on('exit', eventCallback(resolve))
    dbMigrationProcess.on('error', eventCallback(reject))
  })

  if (shouldTruncate)
    await truncateTables(postgres)
}


async function truncateTables(postgres) {
  // Truncate all tables
  await postgres.query(`
    truncate  users_relationships_map,
              users_oauth_integrations,
              relationships_images,
              relationships,
              users;
  `)
}
