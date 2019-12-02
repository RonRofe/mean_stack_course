const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    try {
        const password = await bcrypt.hash(req.body.password, 8);
        const user = new User({
            email: req.body.email,
            password
        });
        const result = await user.save();
        res.status(201).json({
            message: 'User created!',
            result
        });
    } catch(error) {
        res.status(500).json({
            error
        });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(!user) {
            return res.status(401).json({ message: 'Auth failed!' });
        }
        const result = await bcrypt.compare(req.body.password, user.password);
        if(!result) {
            return res.status(401).json({ message: 'Auth failed!' });
        }
        const token = jwt.sign(
            { email: user.email, userId: user._id },
            'secret_this_should_be_longer',
            { expiresIn: '1h' }
        );
        res.status(200).json({ token, expiresIn: 3600, userId: user._id });
    } catch(error) {
        return res.status(401).json({
            message: 'Auth failed!'
        });
    }
});

module.exports = { router };