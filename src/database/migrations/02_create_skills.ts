import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('skills', table => {
    table.increments('id').primary();
    table.string('skill').notNullable();
    table.string('level').notNullable();

    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('skills');
}