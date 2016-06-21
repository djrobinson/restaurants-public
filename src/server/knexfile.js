module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/restaurants'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true'
  }
};