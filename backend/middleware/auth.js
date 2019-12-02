const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const { email, userId } = jwt.verify(token, 'secret_this_should_be_longer');
        req.userData = { email, userId };
        next();
    } catch(e) {
        res.status(401).json({ message: 'Auth failed!' });
    }
}

module.exports = { auth };