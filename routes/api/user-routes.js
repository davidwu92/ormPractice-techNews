const router = require('express').Router();
    // These endpoints for the server are going to be accessible at the /api/users URL.
    // When we create posts and comments later, we'll make those
    // endpoints accessible at /api/posts and /api/comments. Easy.

    const { User, Post, Vote } = require("../../models");

// GET ROUTES' model methods: https://sequelize.org/master/manual/model-querying-finders.html


// GET /api/users (all users)
router.get('/', (req, res) => {
  //Access our User model and run the .findAll() method.
  //when client makes GET request to /api/users...
  //select all users from 'user' table in 'just_tech_news_db', and then send it back as JSON.
  User.findAll({
    attributes: { exclude: ['password'] } //don't give us their passwords.
  })
    .then(users=>res.json(users))
    .catch(e=>{
      console.log(e)
      res.status(500).json(e) //internal server error; can't grab users in db.
    })
});


// GET /api/users/1 (one user)
router.get('/:id', (req, res) => {
  //Access User model, run the .findOne() method.
  //Pass it an object with "where" key, set to object of "filters". Right now we're grabbing user by id.
  User.findOne({
    where: {id: req.params.id},
    attributes: { 
      exclude: ['password'],
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_url', 'created_at']
        },
        {
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        }
      ]
    }
  }) 
    .then(user=>{
      if(!user){
        res.status(404).json({ message: `Failed to find a user with id ${req.params.id}.` });
      }else{
        res.json(user)
      }
    })
    .catch(e=>{
      console.error(e)
      res.status(500).json(e)
    })
});


// POST /api/users (create a new user)
router.post('/', (req, res) => {
  //expecting {username: 'johndoe92', email: 'johndoe@gmail.com', password: 'lalala'}
  User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
  })
    .then(userdata=>res.json(userdata)) //send the created user back to client.
    .catch(e=>{
      console.log(e, "Could not create user.")
      res.status(500).json(e)
    })  
});


// POST /api/users/login (log an existing user in w/ email+password)
router.post('/login', (req,res)=>{
  //expecting req.body {email: 'davidwu92@gmail.com', password: 'password123'}
  User.findOne({
    where: {email: req.body.email}
  }).then(dbUserData=>{
    if(!dbUserData){
      res.send(404).json({message: 'Could not find an existing user with the provided email address.'})
      return;
    }
    
    //User models now have checkPassword method that expects the plaintext pw.
    const validPassword = dbUserData.checkPassword(req.body.password) 
    if(!validPassword){
      res.status(400).json({message: 'Incorrect password.'})
      return;
    }
    
    res.json({user: dbUserData, message: `You've successfully logged in. Welcome, ${dbUserData.username}`})
  })
})


// PUT /api/users/1 (edit one user)
router.put('/:id', (req, res) => {
  //expecting {username: 'johndoe92', email: 'johndoe@gmail.com', password: 'lalala'}

  //User.update() expects two argumentss: 1. new values and 2. options object w/ where property.
  User.update(req.body, {
    individualHooks: true, //we put this in for bcrypt to work.
    where: {
      id: req.params.id
    }
  })
    .then(data => {
      //since User.update finds ALL users that satisfy the "where", "data" is an array.
      if (!data[0]) {
        res.status(404).json({ message: `Cannot update: No user found with id ${req.params.id}` });
      } else{
        res.json(data);
      }
    })
    .catch(e => {
      console.log(e, "Could not update user.");
      res.status(500).json(e);
    });
});


// DELETE /api/users/1 (delete one user)
router.delete('/:id', (req, res) => {
  User.destroy({where: {id: req.params.id}})
    .then(data=>{
      if(!data){
        res.status(404).json({message: `Cannot delete: No user found with id ${req.params.id}`})
      } else{
        res.json({data, message:`User with id ${req.params.id} has been deleted.`})
      }
    })
    .catch(e => {
      console.log(e, "Did not delete user.");
      res.status(500).json(e);
    });
});


module.exports = router;

