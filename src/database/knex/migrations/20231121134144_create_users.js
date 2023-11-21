exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.string("email");
    table.string("password");
    table.string("avatar").nullable();
    table
      .enum("role", ["admin", "user"], {
        useNative: true,
        enumName: "roles",
      })
      .notNullable()
      .defaultTo("user");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("users", (table) => {});
