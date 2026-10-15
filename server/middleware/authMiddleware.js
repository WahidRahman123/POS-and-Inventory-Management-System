const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.user.id).select("-password");
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed." });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token provided" });
    }
}

// Middleware to check if the use ris an admin

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
}

//* For Developer only
const verifyDeveloperKey = (req, res, next) => {
    const key = req.headers['x-developer-key'] || req.body.developerKey;
    if (!key || key !== process.env.DEVELOPER_SECRET_KEY) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid developer key' });
    }
    next();
};

module.exports = { protect, admin, verifyDeveloperKey };