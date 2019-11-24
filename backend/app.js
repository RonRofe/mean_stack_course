const express = require('express');
const mongoose = require('mongoose')

const { Post } = require('./models/post')

const app = express();

mongoose.connect(
    'mongodb+srv://rapitec:diGJCZgj3PvNJh0t@cluster0-gmdpj.mongodb.net/node-angular?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log('Connected to database successfully!');
}).catch(() => {
    console.log('Database connection failed!');
});

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
})

app.post('/api/posts', async (req, res, next) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
        const postId = await post.save();
        res.status(201).json({
            message: 'Post added successfully',
            postId: postId._id
        });
    } catch(e) {

    }
});

app.patch('/api/posts/:id', async (req, res, next) => {
    try {
        const newPost = await Post.updateOne({
            _id: req.params.id
        }, {
            title: req.body.title,
            content: req.body.content
        });
        res.status(200).json({ message: 'Update successful!' })
    } catch(e) {

    }
});

app.get('/api/posts', async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts
        });
    } catch(e) {

    }
});

app.get('/api/posts/:id', async(req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(post) {
        res.status(200).json(post);
    } else {
        res.status(404).json({ message: 'Post not found!' });
    }
});

app.delete('/api/posts/:id', async (req, res, next) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Post deleted!' });
    } catch(e) {

    }
});

module.exports = app;