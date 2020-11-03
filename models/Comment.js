const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

const commentSchema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  comment_text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  post_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'post',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id'
    }
  }
}

const tableConfig = {
  sequelize,
  freezeTableName: true,
  underscored: true,
  modelName: 'comment'
}

Comment.init(commentSchema,tableConfig);

module.exports = Comment;