import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.table('users', (table) => {
    table.string('password');
  });
}

export async function down(knex: Knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('password');
  });
}
