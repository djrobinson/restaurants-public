var knex = require('./knex');


function Restaurants() {
  return knex('restaurants');
}

function Reviews() {
  return knex('reviews');
}

module.exports = {
  allRestaurants: function(){
    return Restaurants().select();
  },
  averageReview: function(){
    return Reviews().select('restaurant_id')
                    .avg('rating')
                    .groupBy('restaurant_id');
  },
  createRestaurant: function(restaurant){
    return Restaurants().insert(restaurant);
  },
  getRestaurant: function(id){
    return Restaurants().where('id', id);
  },
  editRestaurant: function(id, restaurant){
    return Restaurants().where('id', id)
                        .update(restaurant);
  },
  getRestaurantReviews: function(id){
    return Reviews().where('restaurant_id', id);
  },
  getSingleAverage: function(id){
    return Reviews().avg('rating')
                    .where('restaurant_id', id)

  },
  //This isn't working. Need to fix Delete Cascade
  deleteRestaurant: function(id){
    return Restaurants().where('id', id)
                        .del();
  },
  createReview: function(review, id){
    review.restaurant_id = id;
    return Reviews().insert(review);
  },
  getReview: function(id){
    return Reviews().where('id', id);
  },
  editReview: function(id, review){
    return Reviews().where('id', id)
                  .update(review)
  },
  reviewByName: function(name){
    return Reviews().where('name', name);
  },
  restaurantByName: function(name){
    return Restaurants().where('name', name);
  }
};



// var query = client.query("SELECT * FROM restaurants WHERE id="+id);

// var query = client.query("SELECT * FROM reviews WHERE restaurant_id="+id);

// var query = client.query("SELECT AVG(rating) FROM reviews WHERE restaurant_id="+id);

// var query = client.query("DELETE FROM restaurants WHERE id="+req.params.id);

// var query = client.query("INSERT INTO reviews VALUES (DEFAULT, "+id+", '"+review.name+"', '"+review.review_date+"', "+parseInt(review.rating)+", '"+review.review+"')");

// var query = client.query("SELECT * FROM reviews WHERE id="+id);

// var query = client.query("UPDATE reviews SET name='"+review.name+"', review_date='"+review.review_date+"', rating="+review.rating+", review='"+review.review+"' WHERE id="+id);
