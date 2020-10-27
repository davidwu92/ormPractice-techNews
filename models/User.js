//User.js creates the table for users.

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const bcrypt = require('bcrypt'); //bcrypt lets us hash passwords before storing in db

// create our User model
class User extends Model {}

//Keeping it clean: columns and tableConfig are the objects we'll pass to User.init() to create a table in our 'just_tech_news_db'. The table (and model) is called "user".

const columns = {
  id:{
    // use the special Sequelize DataTypes object provide what type of data it is
    type: DataTypes.INTEGER,
    allowNull: false, //`NOT NULL` in SQL
    primaryKey: true, // sets id as the Primary Key
                  //If we didn't define the model to have a primaryKey option set up anywhere, Sequelize would create one for us. But it's best we explicitly define all of the data.
    autoIncrement: true // turn on auto increment for id's.
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // there cannot be any duplicate email values in this table
    // if allowNull is set to false, we can run our data through validators before creating the table data
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // this means the password must be at least four characters long
      len: [4]
    }
  }
}

const tableConfig = {
  // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
  
  /* HOOKS, AKA lifecycle events, are Sequelize functions that are called before or after Sequelize calls.
     We'll put them into this config object.  */
  hooks:{
    async beforeCreate(newUserData){ //runs before creating new user; hashes their password.
      newUserData.password = await bcrypt.hash(newUserData.password, 10);
      return newUserData;
    },
      
    async beforeUpdate(updatedUserData) {
      updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
      return updatedUserData;
    }
  },

  // pass in our imported sequelize connection (the direct connection to our database)
  sequelize,
  // don't automatically create createdAt/updatedAt timestamp fields
  timestamps: false,
  // don't pluralize name of database table
  freezeTableName: true,
  // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
  underscored: true,
  // make it so our model name stays lowercase in the database
  modelName: 'user'
}

//User.init takes two objects: first one defines columns, second defines table config.
User.init(columns, tableConfig);

module.exports = User;