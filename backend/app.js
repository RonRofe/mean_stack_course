const express = require('express');

const app = express();

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
diGJCZgj3PvNJh0t
app.post('/api/posts', (req, res, next) => {
    const posts = req.body;
    console.log(posts);
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: '123456sfdgds',
            title: 'First server-side post',
            content: 'This is coming from ther server'
        },
        {
            id: '12345asdsad6sfdgds',
            title: 'Second server-side post',
            content: 'This is coming from ther server!'
        }
    ];
    res.status(200).json({
        message: 'Posts fetched successfully!',
        posts
    });
});

module.exports = app;