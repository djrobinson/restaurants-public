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