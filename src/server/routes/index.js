var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/restaurants';

var data = require('./data');

var restaurants = data.restaurants;
var states = data.states;
var cuisines = data.cuisines;

var queries = require('../db/main_queries');

var knex = require('../db/knex');
var passport = require('../lib/auth');
var helpers = require('../lib/helpers');

function validateUser(req){
  console.log("req.user", req.user);
  if(req.user===undefined){
    return false;
  } else if(req.user.admin==='admin'){
    return 'admin';
  } else if(req.user.admin==='user'){
    return 'user';
  } else {
    return false;
  }
}

//////////////////HOME ROUTES///////////////////
router.get('/', function(req, res, next) {
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
    ///This is horrible, fix it
  queries.allRestaurants().then(
    function(restaurants){
      queries.averageReview().then(
        function(reviews){
          reviews.map(function(review){
            restaurants.map(function(rest, i){
              if(review.restaurant_id === rest.id) {
                var ratingStr = "";
                for (var j = 0; j < Math.round( +review.avg ); j++){
                  ratingStr = ratingStr.concat('&#x2605;');
                }
                restaurants[i].rating = ratingStr;
              }
            });
          });
        res.render('index', { restaurants: restaurants, admin: admin });
      });
    }
  );
});

router.get('/login', function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  res.render('login', { admin: admin });
});

router.post('/login', function(req, res, next) {
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  console.log(admin);
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    } else if (!user){
      return res.redirect('/');
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  })(req, res, next);
});

router.get('/signup', function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  res.render('signup', { admin: admin });
});

router.post('/signup', function(req, res, next){
  var admin = validateUser(req.body);
  var reqAdmin = req.body.admin;
  if (admin === undefined || admin === null){
    reqAdmin = 'user';
  }
  var email = req.body.email;
  var password = req.body.password;

  console.log('admin ',admin);
  console.log('req ', req.body);

  // check if email is unique
  knex('users').where('email', email)
    .then(function(data){
      // if email is in the database send an error
      if(data.length) {
          // req.flash('message', {
          //   status: 'danger',
          //   message: 'Email already exists.!'
          // });
          return res.redirect('/signup');
      } else {
        // hash and salt the password
        var hashedPassword = helpers.hashing(password);
        // if email is not in the database insert it
        knex('users').insert({
          email: email,
          password: hashedPassword,
          admin: reqAdmin
        })
        .then(function(data) {
          // req.flash('message', {
          //   status: 'success',
          //   message: 'Welcome!'
          // });
          return res.redirect('/login');
        })
        .catch(function(err) {
          return res.send(err);
        });
      }
    })
    .catch(function(err){
      return next(err);
    });
});

router.get('/logout', helpers.ensureAuthenticated, function(req, res, next) {
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  req.logout();
  res.redirect('/');
});


router.get('/restaurants', function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  res.redirect('/');
});


/////NEW RESTAURANT PAGE//////////
router.get('/restaurants/new', helpers.ensureAuthenticated, function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  res.render('new', {title: 'New Page',
                     states: states ,
                     cuisines: cuisines});
});

router.post('/restaurants/new', helpers.ensureAuthenticated, function(req, res, next){
  var admin = validateUser(req);

  if (admin === undefined){
    admin = false;
  }
  restaurant = req.body;
  //TODO CHECK FOR RESTAURANT NAME BEFORE INSERTING
  queries.restaurantByName(restaurant.name).then(function(rest){
    if (rest.length < 1){
      queries.createRestaurant(restaurant).then(function(){
        res.redirect('/restaurants');
      });
    } else {
      console.log('Restaurant already exists');
      res.redirect('/');
    }
  }).catch(function(err){
    console.log(err);
  });

});

////////////EDIT RESTAURANT ROUTES//////////////////

router.get('/restaurants/:id/edit', helpers.ensureAuthenticated, function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  var id = req.params.id;
    queries.getRestaurant(id).then(function(restaurant){
      res.render('edit', {
                  restaurant: restaurant[0],
                  cuisines: cuisines,
                  states: states,
                  admin: admin
      });
    });
});

router.post('/restaurants/:id/edit', helpers.ensureAuthenticated, function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  var restaurant = req.body;
  queries.editRestaurant(req.params.id, restaurant).then(function(){
    res.redirect('/restaurants');
  });
});



//////////////////// SHOW ROUTE /////////////////////////

router.get('/restaurants/:id', function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  var id = req.params.id;
  var restaurant;
  var reviews = [];
  queries.getRestaurant(id).then(function(restaurant){
    restaurant = restaurant;
    queries.getRestaurantReviews(id).then(function(reviews){
      reviews.map(function(review){
        var ratingStr = "";
        for (var j = 0; j < review.rating; j++){
          ratingStr = ratingStr.concat('&#x2605;');
        }
        review.rating = ratingStr;
      });
      reviews = reviews;
      queries.getSingleAverage(id).then(function(rev){
        restaurant.rating = Math.round( +rev[0].avg * 10 )/10;
        res.render('show', { reviews: reviews, restaurant: restaurant[0], admin: admin });

      });
    });
  });
});


/////////DELETE RESTAURANT ///////////////////////
router.get('/restaurants/:id/delete', helpers.ensureAuthenticated, function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  //Doesn't work with restaurants that have reviews!!!!
  queries.deleteRestaurant(req.params.id).then(function(){
    res.redirect('/');
  });
});


/////////GET REVIEWS ///////////////////////

router.get('/restaurants/:id/reviews', helpers.ensureAuthenticated, function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  res.render('review', {id: req.params.id, admin: admin });
});

router.post('/restaurants/:id/reviews', helpers.ensureAuthenticated, function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  var id = req.params.id;
  var review = req.body;
  console.log("review: ", review);
  //TODO CHECK FOR REVIEWER ID BEFORE INSERTING
  queries.reviewByName(review.name).then(function(rev){
    console.log(rev);
    if (rev.length < 1){
      queries.createReview(review, id).then(function(){
        res.redirect('/restaurants/'+id);
      });
    } else {
      console.log('Reviewer already exists');
      res.redirect('/');
    }
  }).catch(function(err){
    console.log(err);
  });
});

///////// GET EDIT REVIEW PAGE ///////////////////////


router.get('/restaurants/:id/reviews/:review_id/edit', helpers.ensureAuthenticated, function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  var id = req.params.review_id;
    queries.getReview(id).then(function(review){
      review[0].review_date = formatDate(review[0].review_date);
      res.render('editReview', { review: review[0], admin: admin });
    });
});
///////// EDIT REVIEW ///////////////////////

router.post('/restaurants/:id/reviews/:review_id/edit', helpers.ensureAuthenticated,function(req, res, next){
  var admin = validateUser(req);
  if (admin === undefined){
    admin = false;
  }
  var id = req.params.review_id;
  var review = req.body;
    queries.editReview(id, review).then(function(){
      res.redirect('/restaurants/'+req.params.id);
    });
});


///////// DATE FORMAT HELPER ///////////////////////

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

module.exports = router;
