import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.alterTable("connections", (table) => {
    table.dropColumn("created_at");
    table.string("message");
  });
}

export async function down(knex: Knex) {
  return knex.schema.alterTable("connections", (table) => {
    table
      .timestamp("created_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"))
      .notNullable();
    table.dropColumn("message");
  });
}
