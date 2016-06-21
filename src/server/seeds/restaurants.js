
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('restaurants').del(),

    // Inserts seed entries
    knex('restaurants').insert({
                          name: 'Los Tacos',
                          cuisine: 'Mexican',
                          location: 'Denver',
                          state: 'Colorado',
                          description: 'Pretty good tacos',
                          image: 'http://cf.nutmegnanny.com/wp-content/uploads/2015/03/chipotle-shrimp-tacos-image.jpg'
                        }));
};