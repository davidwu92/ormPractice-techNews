//keep track of all our api routes!
const router = require('express').Router()

const userRoutes = require('./user-routes.js')

//adds the "/users"
router.use('/users', userRoutes);

module.exports = router;