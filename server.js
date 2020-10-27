const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection'); //imports connection to Sequelize

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// tell app to use the routes we wrote.
app.use(routes);


/* 
  turn on connection to db and server.
  The .sync() method is Sequelize taking our models and connecting them to associated database tables.
  If it doesn't find a table, it'll create it for you.
  
  {force: false} says "don't drop and re-create all my db tables on startup."
  We'll set it to true if we ever need to make changes to our sequelize models.
*/
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));
  });
