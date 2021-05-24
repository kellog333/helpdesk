const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const Client = require('../../models/Client');

// @route GET api/auth
// @desc Get User
// @access Private
router.get('/', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user) {
            const client = await Client.findById(req.client.id).select('-password');
            return res.json(client);
        }
        return res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});

// @route POST api/auth
// @desc Auth User and get token
// @access Public
router.post('/', [
    check('email', 'Please provide a valid email address').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if(!user) {
            let client = await Client.findOne({ email });
            if(!client) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }
            const isMatch = await bcrypt.compare(password[0], client.password);
            if(!isMatch) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }
            const payload = {
                client: {
                    id: client.id,
                }
            };
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 86400 },
                (err, token) => {
                    if(err){
                        throw err;
                    }
                    res.json({token});
                }
            );
        };
        const isMatch = await bcrypt.compare(password[0], user.password);
        if(!isMatch) {
            return res.status(400).json({ errors: [ { msg: "Invalid Credentials" } ] });
        }
        const payload = {
            user: {
                id: user.id,
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 86400 },
            (err, token) => {
                if(err){
                    throw err;
                }
                res.json({token});
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;