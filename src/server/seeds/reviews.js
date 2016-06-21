
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('reviews').del(),

    // Inserts seed entries
    knex('reviews').insert({
      restaurant_id: 1,
      name: 'Jerry',
      review_date: '2014-02-02',
      rating: 2,
      review: 'Not too bad!'
    })
  );
};








