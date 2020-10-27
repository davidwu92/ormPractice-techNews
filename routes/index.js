const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes); //prefixes our paths!

router.use((req, res) => {
  res.status(404).end();
  /*
    If a request is made to a nonexistent endpoint, we'll receive a 404 error indicating that
    we requested an incorrect resource, another RESTful API practice.
  */
});

module.exports = router;