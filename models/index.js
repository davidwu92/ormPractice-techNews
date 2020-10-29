// models/index.js

const User = require('./User');
const Post = require('./Post');

User.hasMany(Post, { //each user has many posts.
  foreignKey: 'user_id'
})

Post.belongsTo(User,{
  foreignKey: 'user_id',
  onDelete: "cascade" //when a User is deleted, his associated POSTS are also deleted from db.
})

module.exports = { User, Post };