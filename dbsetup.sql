\connect restaurants;

CREATE TABLE restaurants (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  cuisine varchar(255) NOT NULL,
  location varchar(255) NOT NULL,
  state varchar(255) NOT NULL,
  description text,
  image varchar(255)
);

CREATE TABLE reviews (
  id serial PRIMARY KEY,
  restaurant_id integer REFERENCES restaurants(id) ON DELETE CASCADE,
  name varchar(255),
  review_date date,
  rating int NOT NULL,
  review text
);

INSERT INTO restaurants VALUES (
  DEFAULT,
  'Los Tacos',
  'Mexican',
  'Denver',
  'Colorado',
  'Pretty good tacos',
  'http://cf.nutmegnanny.com/wp-content/uploads/2015/03/chipotle-shrimp-tacos-image.jpg'
),(
  DEFAULT,
  'Burger Bar',
  'American',
  'Denver',
  'Kansas',
  'Pretty good burgers',
  'http://www.seriouseats.com/assets_c/2015/07/20150727-teriyaki-burger-recipe-15-thumb-1500xauto-425275.jpg'
),(
  DEFAULT,
  'Pasta Freddys',
  'Italian',
  'Denver',
  'Colorado',
  'Pretty good pasta',
  'http://foodnetwork.sndimg.com/content/dam/images/food/fullset/2013/9/23/0/GH0602H_grilled-seafood-pasta-fra-diavolo-recipe_s4x3.jpg'
),(
  DEFAULT,
  'Bangkok Grill',
  'Thai',
  'Denver',
  'Colorado',
  'Pretty good thai food',
  'http://www.rakadeka.com/resources/IMG_4564.jpg'
),(
  DEFAULT,
  'Pho Mazing',
  'Vietnamese',
  'Denver',
  'Colorado',
  'Pretty good Pho',
  'http://www.rakadeka.com/resources/IMG_4564.jpg'
),(
  DEFAULT,
  'Fiestaritos',
  'Mexican',
  'Denver',
  'Colorado',
  'Pretty good fiesta',
  'http://cf.nutmegnanny.com/wp-content/uploads/2015/03/chipotle-shrimp-tacos-image.jpg'
);

INSERT INTO reviews VALUES (
  DEFAULT,
  1,
  'Jerry',
  '2014-02-02',
  2,
  'Not too bad!'
);
