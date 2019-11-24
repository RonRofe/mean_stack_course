const express = require('express');
const mongoose = require('mongoose');

const { router: postsRoutes } = require('./routes/posts');

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

app.use('/api/posts', postsRoutes);

module.exports = app;