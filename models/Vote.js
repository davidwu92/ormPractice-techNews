//Vote.js creates a THROUGH TABLE that relates to both User and Post: many to many.

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model {}

const voteSchema =   {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {  //each vote comes from a user. reference by id.
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  post_id: {  //each vote is for a post. reference that post by its id.
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'post',
      key: 'id'
    }
  }
}

const tableConfig = {
  sequelize,
  timestamps: false, //votes don't need timestamps
  freezeTableName: true,
  underscored: true,
  modelName: 'vote'
}

Vote.init(voteSchema,tableConfig);

module.exports = Vote;