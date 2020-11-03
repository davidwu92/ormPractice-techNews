// models/index.js

const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

//POST ASSOCIATIONS

User.hasMany(Post, { //each user has many posts.
  foreignKey: 'user_id'
})

Post.belongsTo(User,{ //each post belongs to one user.
  foreignKey: 'user_id',
  onDelete: "cascade" //when a User is deleted, his associated POSTS are also deleted from db.
})


//VOTE ASSOCIATIONS

User.belongsToMany(Post, { //Querying User should provide all the posts they voted on
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, { //Querying Post should give us all the users who voted on it 
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

Vote.belongsTo(User, {foreignKey: 'user_id'});

Vote.belongsTo(Post, {foreignKey: 'post_id'});

User.hasMany(Vote, {foreignKey: 'user_id'});

Post.hasMany(Vote, {foreignKey: 'post_id'});

Comment.belongsTo(User, {foreignKey: 'user_id'});

Comment.belongsTo(Post, {foreignKey: 'post_id'});

User.hasMany(Comment, {foreignKey: 'user_id'});

Post.hasMany(Comment, {foreignKey: 'post_id'});

module.exports = { User, Post, Vote, Comment};