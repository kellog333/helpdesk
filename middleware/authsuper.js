const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if(!token) {
        return res.status(401).json({ msg: "Not authorized"})
    };

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        const user = await User.findById(req.user.id).select('-password');
        if(!user.employee){
            return res.status(401).json({ msg: "Not authorized" });
        }
        if(!user.role.includes('SuperAdmin')) {
            return res.status(401).json({ msg: "Not authorized" });
        }        
        next();
    } catch (err) {
        res.status(401).json('Invalid Token')
    }
}