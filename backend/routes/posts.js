const express = require('express');
const multer = require('multer');

const {
    createPost,
    updatePost,
    getPosts,
    getPost,
    deletePost
} = require('../controllers/posts');
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

router.post('', auth, multer({ storage }).single('image'), createPost);

router.patch('/:id', auth, multer({ storage }).single('image'), updatePost);

router.get('', getPosts);

router.get('/:id', getPost);

router.delete('/:id', auth, deletePost);

module.exports = { router };