//keep track of all our api routes!
const router = require('express').Router()

const userRoutes = require('./user-routes.js')
const postRoutes = require('./post-routes.js')
const commentRoutes = require('./comment-routes.js')

//adds the "/users"
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;