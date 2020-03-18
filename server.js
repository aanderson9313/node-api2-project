const express = require('express');
const postRouter = require('../posts/post-router');
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Server is working!');
});

server.use('api/posts', postRouter);
module.exports = server;