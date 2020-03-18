const express = require('express');
const router = express.Router();

const db = require('../data/db.js');


router.use(express.json());
//endpoints

// creates a post 
// POST request:
router.post('/', (req, res) => {
    const data = req.body;

    if(!data.title || !data.contents) {
        res.status(400).json({errorMessage: 'Please provide title and contents for the post.'})
    } else {
        db.insert(data)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            console.log('Error on POST /api/posts:', error);
            res.status(500).json({
                errorMessage: 'there was an error while saving the post to the database'
            })
        })
    }
})


//creates comment with specific id

router.post('/:id/comments', (req, res) => {
    const data = req.body;

    if (!data.text) {
        res.status(400).json({ errorMessage: 'Please provide some text for the comment'})
    } else {
        db.insertComment(data)
        .then(comment => {
            if (comment) {
                res.status(201).json(comment)
            } else {
                res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.'})
            }
        })
        .catch(error => {
            console.log('Error on POST /api/posts/:id/comments', error);
            res.status(500).json({
                errorMessage: 'There was an error saving the comment to the database'
            })
        })
    }
})

//GET requests
//returns all posts in database

router.get('/', (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log('Error on GET api/posts', err);
        res.status(500).json({
            errorMessage: 'The posts information could not be retrieved'
        })
    })
})

//returns posts with specific id

router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.findById()
    .then(post => {
        if(post.length !== 0) {
           res.status(200).json(post); 
        } else {
            res.status(404).json({
                errorMessage: 'The post with the specific ID does not exist.'
            })
        }
        
    })
    .catch(err => {
        console.log('Error on GET api/posts/:id/comments', err);
        res.status(500).json({
            errorMessage: 'The post information could not be retrieved'
        })
    })
})

//DELETE requests
//deletes post by specific id and returns post

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then( post => {
            if(post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.'})
            }
        })
        .catch(err => {
            console.log('Error on DELETE api/posts/:id', err);
            res.status(500).json({ errorMessage: 'the post could not be removed.'})
        })
})

//UPDATE requests
//updates the posts with a specific id

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    if (!data.title || !data.contents) {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.'})
    } else { 
        db.update(id, data)
        .then(post => {
            if (post) {
                res.status(200).json(data)
            } else {
                res.status(404).json({
                    errorMessage: 'The post with the specified ID does not exist.'
                })
            }
        })
        .catch(err => {
            console.log('Error on DELETE api/posts/:id', err);
            res.status(500).json({
                errorMessage: 'The post information could not be modified.'
            })
        })
    }
})


module.exports = router;

