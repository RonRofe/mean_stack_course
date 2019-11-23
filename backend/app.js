const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
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