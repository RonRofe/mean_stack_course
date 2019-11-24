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
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
})

app.post('/api/posts', async (req, res, next) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
        await post.save();
        res.status(201).json({
            message: 'Post added successfully'
        });
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

module.exports = app;