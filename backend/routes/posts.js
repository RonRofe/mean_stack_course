const express = require('express');

const { extractFile } = require('../middleware/file');

const {
    createPost,
    updatePost,
    getPosts,
    getPost,
    deletePost
} = require('../controllers/posts');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('', auth, extractFile, createPost);

router.patch('/:id', auth, extractFile, updatePost);

router.get('', getPosts);

router.get('/:id', getPost);

router.delete('/:id', auth, deletePost);

module.exports = { router };