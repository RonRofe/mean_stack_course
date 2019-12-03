const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const { email, userId } = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { email, userId };
        next();
    } catch(e) {
        res.status(401).json({ message: 'You are not authenticated!' });
    }
}

module.exports = { auth };