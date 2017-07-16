import path from 'path'
import UiqPostgres from '../libs/UiqPostgres.js'

const postgres_url = process.env.TEST_DB || process.env.DATABASE_URL || 'postgresql://localhost:5432/rake_spec'
const noop = () => {}

const postgres = new UiqPostgres(postgres_url, {max: 1})

export async function connect(shouldTruncate) {
  await _init(postgres, shouldTruncate)
  return postgres
}

async function _init(postgres, shouldTruncate) {
  await createUsers(postgres)
  await createRelationships(postgres)

  if (shouldTruncate)
    await truncateTables(postgres)
}


async function createUsers(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS users (
      id serial,
      username string,
      password string,
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createRelationships(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS relationships (
      id serial,
      username string,
      path string,
      relationship_image string,
      relationship_started timestamp(6) without time zone,
      relationship_married timestamp(6) without time zone,
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function truncateTables(postgres) {
  // Truncate all tables
  await postgres.query(`
    truncate  users
              relationships;
  `)
}
