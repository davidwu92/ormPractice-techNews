const router = require('express').Router();

const {Post, User, Vote, Comment} = require('../../models');

const sequelize = require('../../config/connection'); //to receive updated info on posts (when voting)


//GET /api/posts          GRAB ALL POSTS
router.get('/', (req, res)=>{
  console.log('~~~~~~~~~~~~~~ GETTING POSTS ~~~~~~~~~~~~~~')
  Post.findAll({
    attributes: ['id', 'post_url', 'title', 'created_at', 
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      //this grabs the VOTES on each post as well.
    ], //this determines what post attributes to grab.
    order: [['created_at', 'DESC']], //this orders the array of posts. USE A NESTED ARRAY.
    include: [ //this include property sets up the JOIN.
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(postData=> res.json(postData))
    .catch(e=>{
      console.error(e)
      res.status(500).json(e)
    })
})

//GET /api/posts/:id      GRAB ONE POST BY ITS ID
router.get('/:id', (req, res)=>{
  Post.findOne({
    where: {id: req.params.id},
    attributes: ['id', 'post_url', 'title', 'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(postData=>{
      if(!postData){
        res.status(404).json({ message: `No post found with id: ${req.params.id}` });
        return;
      }
      res.json(postData)
    })
    .catch(e=>{
      console.error(e)
      res.status(500).json({err, message: `Error: Couldn't perform db query or something.`});
    })
})

//POST /api/posts         CREATE A POST
router.post('/', (req, res)=>{
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.body.user_id
  })
    .then(data=>res.json(data))
    .catch(e=>{
      console.error(e)
      res.send(500).json({e, message: 'Something wrong with db query.'})
    })
})

//PUT /api/posts/upvote   UPVOTE A POST
router.put('/upvote', (req, res)=>{ //this route must be written before put('/:id').
  // custom static method created in models/Post.js.
  Post.upvote(req.body, { Vote })
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
})

//PUT /api/posts/:id      EDIT ONE POST'S TITLE
router.put('/:id', (req, res)=>{
  Post.update(
    {title: req.body.title}, //new value(s) here.
    {where: {id: req.params.id}} //options here.
  )
    .then(data=>{
      if(!data){
        res.send(404).json({message: `No post could be found with that id. Update not saved.`});
        return;
      }
      res.json(data) //tells us the number of rows that have changed.
    })
    .catch(e=>{
      console.error(e)
      res.send(500).json({e, message: `Serverside issue.`})
    })
})

//DELETE /api/posts/:id   DELETE ONE POST
router.delete('/:id', (req, res)=>{
  Post.destroy({
    where: {id: req.params.id}
  })
    .then(data=>{
      if(!data){
        res.status(404).json({ message: `No post found with id ${req.params.id}` })
        return
      }
      res.json(data)
    })
    .catch(e=>{
      console.error(e)
      res.status(500).json(err)
    })
})




module.exports = router