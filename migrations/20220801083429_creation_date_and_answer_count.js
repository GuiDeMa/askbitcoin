/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.table("questions", (table) => {
    table.time("created_at");

    table.integer("answer_count");
  });

  await knex.schema.table("answers", (table) => {
    table.time("created_at");

    //table.integer('reply_count') // Do we want to allow replies to answers?
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table("questions", (table) => {
    table.dropColumn("created_at");

    table.dropColumn("answer_count");
  });

  await knex.schema.table("answers", (table) => {
    table.dropColumn("created_at");

    // table.dropColumn('reply_count')
  });
};
