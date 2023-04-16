/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
<<<<<<< HEAD
  return knex.schema
    .withSchema(process.env.DB_LOCAL_DBNAME)
    .createTable("inventories", (table) => {
      table.uuid("id").primary();
      table
        .uuid("warehouse_id")
        .references("warehouses.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("item_name").notNullable();
      table.string("description").notNullable();
      table.string("category").notNullable();
      table.string("status").notNullable();
      table.integer("quantity").notNullable();
      table.timestamps(true, true);
    });
=======
  return knex.schema.withSchema(process.env.DB_LOCAL_DBNAME).createTable('inventories', (table) => {
    table.uuid('id').primary();
    table
      .uuid('warehouse_id')
      .references('warehouses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('item_name').notNullable();
    table.string('description').notNullable();
    table.string('category').notNullable();
    table.string('status').notNullable();
    table.integer('quantity').notNullable();
    table.timestamps(true, true);
  });
>>>>>>> develop
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
<<<<<<< HEAD
  return knex.schema.dropTable("inventories");
=======
  return knex.schema.withSchema(process.env.DB_LOCAL_DBNAME).dropTable('inventories');
>>>>>>> develop
};
