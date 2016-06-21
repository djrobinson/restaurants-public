
exports.up = function(knex, Promise) {
  return knex.schema.createTable('reviews', function(table){
    table.increments();
    table.integer('restaurant_id').references('restaurants.id').onDelete('CASCADE');
    table.string('name');
    table.date('review_date');
    table.integer('rating');
    table.text('review');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('reviews');
};
