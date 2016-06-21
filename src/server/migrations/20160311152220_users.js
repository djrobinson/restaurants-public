
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('admin');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};