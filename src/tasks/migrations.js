import bunyan from 'bunyan'
import PostgresClient from '../libs/PostgresClient'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)
const postgres_url = process.env.DATABASE_URL || 'postgres://localhost:5432/ourlove_test'

const postgres = new PostgresClient(postgres_url, {max: 1})

;(async () => {
  try {
    await Promise.all([
      createUsers(postgres),
      createUsersOAuthIntegrations(postgres),
      createUsersOAuthIntegrationsIndexes(postgres),
      createRelationships(postgres),
      createRelationshipsIndexes(postgres),
      createUsersRelationshipsMap(postgres),
      createUsersRelationshipsMapIndexes(postgres),
      createRelationshipsImages(postgres),
      createRelationshipsImagesIndexes(postgres),
      createRelationshipMilestones(postgres),
      createRelationshipMilestonesIndexes(postgres),
      createRelationshipReminders(postgres),
      createRelationshipRemindersIndexes(postgres),
      createTags(postgres),
      createTagsIndexes(postgres),
      createRelationshipTagsMap(postgres),
      createRelationshipTagsMapIndexes(postgres),

      addProfilePictureToUsers(postgres)
    ])

    log.info("Successfully ran DB migrations!")
    process.exit()

  } catch(err) {
    log.error("Error running DB migrations", err)
    process.exit()
  }
})()

async function createUsers(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      name varchar(255),
      primary_email varchar(255),
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createUsersOAuthIntegrations(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS users_oauth_integrations (
      id serial PRIMARY KEY,
      user_id integer REFERENCES users,
      type varchar(255),
      unique_id varchar(255),
      access_token varchar(255),
      refresh_token varchar(255),
      first_name varchar(255),
      last_name varchar(255),
      email varchar(255),
      expires timestamp,
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createUsersOAuthIntegrationsIndexes(postgres) {
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS users_oauth_integrations_user_id on users_oauth_integrations (user_id)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS users_oauth_integrations_unique_id on users_oauth_integrations (unique_id)`)
}

async function createRelationships(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS relationships (
      id serial PRIMARY KEY,
      created_user_id integer REFERENCES users,
      path varchar(255),
      private boolean,
      private_password text,
      person1_name varchar(255),
      person1_birthday date,
      person2_name varchar(255),
      person2_birthday date,
      relationship_started timestamp(6) without time zone,
      relationship_married timestamp(6) without time zone,
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createRelationshipsIndexes(postgres) {
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationships_created_user_id on relationships (created_user_id)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationships_path on relationships (path)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationships_private on relationships (private)`)
}

async function createUsersRelationshipsMap(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS users_relationships_map (
      id serial PRIMARY KEY,
      user_id integer REFERENCES users,
      relationships_id integer REFERENCES relationships,
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createUsersRelationshipsMapIndexes(postgres) {
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS users_relationships_map_user_id on users_relationships_map (user_id)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS users_relationships_map_relationships_id on users_relationships_map (relationships_id)`)
}

async function createRelationshipsImages(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS relationships_images (
      id serial PRIMARY KEY,
      relationships_id integer REFERENCES relationships,
      is_hidden boolean,
      image_type varchar(255),
      image_type_uid varchar(255),
      relationship_primary_image boolean,
      main_image_name varchar(255),
      medium_image_name varchar(255),
      small_image_name varchar(255),
      tiny_image_name varchar(255),
      orientation varchar(255),
      image_taken timestamp,
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createRelationshipsImagesIndexes(postgres) {
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationships_images_relationships_id on relationships_images (relationships_id)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationships_images_created_at on relationships_images (created_at)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationships_images_image_taken on relationships_images (image_taken)`)
}

async function createRelationshipMilestones(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS relationship_milestones (
      id serial PRIMARY KEY,
      relationships_id integer REFERENCES relationships,
      is_hidden boolean,
      image_id integer REFERENCES relationships_images,
      milestone_time timestamp,
      title varchar(255),
      subtitle varchar(255),
      description text,
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createRelationshipMilestonesIndexes(postgres) {
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationship_milestones_relationships_id on relationship_milestones (relationships_id)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationship_milestones_is_hidden on relationship_milestones (is_hidden)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationship_milestones_image_id on relationship_milestones (image_id)`)
}

async function createRelationshipReminders(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS relationship_reminders (
      id serial PRIMARY KEY,
      relationships_id integer REFERENCES relationships,
      milestone_id integer REFERENCES relationship_milestones,
      is_active boolean,
      reminder_type varchar(255),
      days_before_milestone_to_remind integer,
      emails text,
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createRelationshipRemindersIndexes(postgres) {
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationship_reminders_relationships_id on relationship_reminders (relationships_id)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationship_reminders_milestone_id on relationship_reminders (milestone_id)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationship_reminders_is_active on relationship_reminders (is_active)`)
}

async function createTags(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS tags (
      id serial PRIMARY KEY,
      tag_name varchar(255),
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createTagsIndexes(postgres) {
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS tags_tag_name on tags (tag_name)`)
}

async function createRelationshipTagsMap(postgres) {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS relationship_tags_map (
      id serial PRIMARY KEY,
      tags_id integer REFERENCES tags,
      relationships_id integer REFERENCES relationships,
      created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
      updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
    );
  `)
}

async function createRelationshipTagsMapIndexes(postgres) {
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationship_tags_map_tags_id on relationship_tags_map (tags_id)`)
  await postgres.query(`CREATE INDEX CONCURRENTLY IF NOT EXISTS relationship_tags_map_relationships_id on relationship_tags_map (relationships_id)`)
}

async function addProfilePictureToUsers(postgres) {
  await postgres.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture varchar(255)')
}
