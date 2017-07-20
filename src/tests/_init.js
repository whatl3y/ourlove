import path from 'path'
import PostgresClient from '../libs/PostgresClient'

const postgres_url = process.env.TEST_DB || process.env.DATABASE_URL || 'postgresql://localhost:5432/ourlove_test'
const noop = () => {}

const postgres = new PostgresClient(postgres_url, {max: 1})

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
      username varchar(255),
      password varchar(255),
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createRelationships(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS relationships (
      id serial,
      username varchar(255),
      path varchar(255),
      person1_name varchar(255),
      person2_name varchar(255),
      relationship_image varchar(255),
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
