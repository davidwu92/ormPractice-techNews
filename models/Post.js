const {Model, DataTypes} = require('sequelize')
const sequelize = require('../config/connection')

class Post extends Model {
  /*
    static means this method is one based on the Post model.
    Not an INSTANCE method (like the User model). We can execute Post.upvote().
    This method is expecting req.body as "body" and an object of the models as "models".
  */
  static upvote(body, models) {
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
            'vote_count'
          ]
        ]
      });
    });
  }
}

const postSchema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  post_url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isURL: true
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
  underscored: true, //this made all our column titles have underscores: created_at
  modelName: 'post'
}

Post.init(postSchema, tableConfig)

module.exports = Post