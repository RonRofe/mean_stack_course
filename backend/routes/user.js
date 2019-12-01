const express = require('express');
const bcrypt = require('bcryptjs');

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

module.exports = { router };