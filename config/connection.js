// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

// need this line to configure our .env file.
// This makes the .env variables available to us at process.env.<varname>
require('dotenv').config();

// create connection to our database, pass in your MySQL information for username and password
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;

//so we have successfully connected to our database, 'just_tech_news_db'. We'll make tables in the MODELS.