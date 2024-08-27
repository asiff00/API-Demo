const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).json({error: 'No token provided'});

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(401).json({error: 'Failed to authenticate token'});
        req.userId = decoded.id;
        next();
    });
};