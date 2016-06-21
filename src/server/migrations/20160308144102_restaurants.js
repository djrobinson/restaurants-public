  exports.up = function(knex, Promise) {
  return knex.schema.createTable('restaurants', function(table){
    table.increments();
    table.string('name');
    table.string('cuisine');
    table.string('location');
    table.string('state');
    table.text('description');
    table.string('image');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('restaurants');
};
