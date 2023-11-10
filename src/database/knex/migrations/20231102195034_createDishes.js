exports.up = (knex) =>
  knex.schema.createTable("dishes", (table) => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("users");
    table.string("name");
    table.text("description");
    table.string("image_url");
    table.integer("discount");
    table.integer("price").notNullable();
    table.string("categories");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.createTable("dishes", (table) => {});
