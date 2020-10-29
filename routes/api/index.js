//keep track of all our api routes!
const router = require('express').Router()

const userRoutes = require('./user-routes.js')
const postRoutes = require('./post-routes.js')

//adds the "/users"
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;