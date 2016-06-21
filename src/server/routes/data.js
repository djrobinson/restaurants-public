
////////RESTAURANT CREATION/EDIT HELPER FUNCTIONS & OBJECTS

var createRestaurant = function(title, location, image, state, cuisine, rating, description) {
  this.title = title;
  this.location = location;
  this.image = image;
  this.state = state;
  this.cuisine = cuisine;
  this.rating = rating;
  this.description = description;
}


var restaurants = {};

var id = 0;

var addRestaurant = function(restaurant){
  console.log("Add Restaurant running");
  id++;
  restaurant.id = id;
  restaurants[id] = restaurant;
  return id;
  }


////////SELECT FORM DATA FOR STATES & CUISINE

var states = [
    'Alabama', 'Alaska','Arizona','Arkansas',
    'California', 'Colorado', 'Connecticut', 'Delaware',
    'District Of Columbia', 'Florida', 'Georgia', 'Hawaii',
    'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
    'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire','New Jersey', 'New Mexico', 'New York',
    'North Carolina','North Dakota', 'Ohio', 'Oklahoma',
    'Oregon','Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin',
    'Wyoming'
  ];

var cuisines = ["American", "Italian", "Mexican", "Thai", "Vietnamese"]

///////TESTING DATA SETUP

var testRest1 = new createRestaurant('Los Tacos', 'Denver', 'http://cf.nutmegnanny.com/wp-content/uploads/2015/03/chipotle-shrimp-tacos-image.jpg', 'Colorado', 'Mexican', 4, 'Taco Taco');

var testRest2 = new createRestaurant('Burger Bar', 'Denver', 'http://eastcoastkitchen.co.uk/wp-content/uploads/2015/03/ECK-Burger.jpg', 'Colorado', 'American', 4, 'Burger Burger');

var testRest3 = new createRestaurant('Pasta Freddy\'s', 'Denver', 'http://foodnetwork.sndimg.com/content/dam/images/food/fullset/2013/9/23/0/GH0602H_grilled-seafood-pasta-fra-diavolo-recipe_s4x3.jpg', 'Colorado', 'Italian', 4, 'Pasta Pasta');

var testRest4 = new createRestaurant('Bangkok Grill', 'Denver', 'http://www.rakadeka.com/resources/IMG_4564.jpg', 'Colorado', 'Thai', 4, 'Food Food');

var testRest5 = new createRestaurant('Pho Mazing', 'Denver', 'https://gardenofglutenfree.files.wordpress.com/2012/05/final-blog.jpg', 'Colorado', 'Vietnamese', 4, 'Pho Pho');

var testRest6 = new createRestaurant('Fiestaritos', 'Denver', 'http://cf.nutmegnanny.com/wp-content/uploads/2015/03/chipotle-shrimp-tacos-image.jpg', 'Colorado', 'Mexican', 4, 'Fiesta');

addRestaurant(testRest1);
addRestaurant(testRest2);
addRestaurant(testRest3);
addRestaurant(testRest4);
addRestaurant(testRest5);
addRestaurant(testRest6);
module.exports = {
  createRestaurant: createRestaurant,
  addRestaurant: addRestaurant,
  restaurants: restaurants,
  states: states,
  cuisines: cuisines
};