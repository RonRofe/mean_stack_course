const { Post } = require('../models/post');

const createPost = async (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    try {
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
        res.status(500).json({ message: 'Creating a post failed!' });
    }
};

const updatePost = async (req, res, next) => {
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
        if(result.n <= 0) {
            return res.status(401).json({ message: 'Not authorized!' })
        }
        res.status(200).json({ message: 'Update successful!' });
    } catch(e) {
        res.status(500).json({ message: 'Couldn\'nt update post!' });
    }
};

const getPosts = (req, res, next) => {
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
    }).catch(() => {
        res.status(500).json({ message: 'Fetching posts failed!' });
    });
};

const getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post) {
            return res.status(200).json(post);
        }
        res.status(404).json({ message: 'Post not found!' });
    } catch(e) {
        res.status(500).json({ message: 'Fetching post failed!' });
    }
};

const deletePost = async (req, res, next) => {
    try {
        const result = await Post.deleteOne({ _id: req.params.id, creator: req.userData.userId });
        if(result.n <= 0) {
            return res.status(401).json({ message: 'Not authorized!' });;
        }
        res.status(200).json({ message: 'Post deleted!' });
    } catch(e) {
        res.status(500).json({ message: 'Deleting post failed!' });
    }
};

module.exports = {
    createPost,
    updatePost,
    getPosts,
    getPost,
    deletePost
};