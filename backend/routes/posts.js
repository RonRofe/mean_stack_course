const express = require('express');
const multer = require('multer');

const { Post } = require('../models/post');
const { auth } = require('../middleware/auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination(req, file, callback) {
        const isValid = MIME_TYPE_MAP[file.mimetype];

        if(isValid) {
            callback(undefined, './backend/images');
        } else {
            callback(new Error('Invalid mine type'));
        }
    },
    filename(req, file, callback) {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post('', auth, multer({ storage }).single('image'), async (req, res, next) => {
    try {
        const url = req.protocol + '://' + req.get('host');
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + '/images/' + req.file.filename,
            creator: req.userData.userId
        });
        const createdPost = await post.save();
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    } catch(e) {

    }
});

router.patch('/:id', auth, multer({ storage }).single('image'), async (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    try {
        const result = await Post.updateOne({
            _id: req.params.id,
            creator: req.userData.userId
        }, {
            title: req.body.title,
            content: req.body.content,
            imagePath
        });
        if(result.n > 0) {
            res.status(200).json({ message: 'Update successful!' })
        } else {
            res.status(401).json({ message: 'Not authorized!' })
        }
    } catch(e) {

    }
});

router.get('', (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let posts;
    if(pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery.then(fetchedPosts => {
        posts = fetchedPosts;
        return Post.count();
    }).then(maxPosts => {
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts,
            maxPosts
        });
    });
});

router.get('/:id', async(req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(post) {
        res.status(200).json(post);
    } else {
        res.status(404).json({ message: 'Post not found!' });
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    try {
        const result = await Post.deleteOne({ _id: req.params.id, creator: req.userData.userId });
        if(result.n > 0) {
            res.status(200).json({ message: 'Post deleted!' });
        } else {
            res.status(401).json({ message: 'Not authorized!' });
        }
    } catch(e) {

    }
});

module.exports = { router };