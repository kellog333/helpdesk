const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Client = require('../../models/Client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const authemp = require('../../middleware/authemp');
const authadmin = require('../../middleware/authadmin');
const { route } = require('./users');
const Customers = require('../../models/Customers');
const Invitations = require('../../models/Invitations');
const { v4: uuidv4} = require('uuid');



// @route GET /api/client
// @desc Get Clients
// @access Private
router.get('/', auth, async (req, res) => {
    const { client } = req.body;
    try {
        const clients = Client.find().select('-password');
        res.json(client);
    } catch(err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
});

// @route GET /api/client/byid/:id
// @desc Get Client by id
// @access Private
router.get('/byid/:id', authemp, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).select('-password');
        res.json(client);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
});

// @route GET /api/client/:company
// @desc Search Client by company
// @access Private
router.get('/:company', authemp, async (req, res) => {
    try {
        const result = await Client.find({ "company": req.params.company })
        res.json(result)
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server Error" })
    }
})

// @route POST api/client/adduser
// @desc Create User from admin portal
// @access Private
router.post('/adduser', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('company', 'Company is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty(),
], authemp, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        name,
        email,
        company,
        phone
    } = req.body;
    try {
        let compan = await Customers.findById(company);
        if(!company){
            return res.status(404).json('Company not found');
        }
        let client = await Client.findOne({email});
        if(client){
            return res.status(400).json('Client already exists');
        }
        let password = uuidv4();
        client = new Client({
            name,
            email,
            password: password,
            phone,
            company,
            companyname: compan.company
        });
        const salt = await bcrypt.genSalt(15);
        client.password = await bcrypt.hash(password, salt);
        await client.save();
        const newUser = {
            user: client.id,
            name: name,
            email: email,
            phone: client.phone
        }
        compan.users.unshift(newUser);
        compan.save();
        return res.json({ msg: "Client created" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

// @route POST api/client
// @desc Create User assigned to company
// @access Public
router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('phone', 'Phone Number is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('invitation', 'Invitation code is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        name,
        email,
        phone,
        password,
        invitation,  
    } = req.body;
    try {
        let client = await Client.findOne({ email });
        if (client) {
            return res.status(400).json({ errors: [ { msg: "User already exists" } ]});
        }
        let code = await Invitations.findOne({ invitecode: invitation });
        if(!code) {
            return res.status(401).json({ msg: "Invalid invitation code "});
        }
        let compo = await Customers.findById(code.company);
        let { company } = code;
        client = new Client({
            name,
            email,
            password,
            phone,
            company,
            companyname: compo.company
        });
        const salt = await bcrypt.genSalt(15);
        client.password = await bcrypt.hash(password, salt);

        await client.save();
        const payload = {
            client: {
                id: client.id,
            }
        }
        const compan = await Customers.findById(company);
        if(!compan){
            return res.status(404).json({ msg: "Company does not exist" })
        }
        const newUser = {
            user: client.id,
            name: name,
            email: email,
            phone: client.phone
        }
        compan.users.unshift(newUser);
        compan.save();
        code.remove();
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 86400},
            (err, token) => {
                if(err) {
                    throw err;
                }
                res.json({ msg: "User Created"});
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route DELETE /api/client/:id
// @desc Remove Client
// @access Admin Only
router.delete('/:id', authadmin, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ msg: "Client not found" });
        }
        const company = await Customer.findById(client.company);
        if (!company) {
            return res.status(404).json({ msg: "Company not found" });
        }
        const removeIndex = company.users.map(user => user.user.toString()).indexOf(req.params.id)
        company.users.splice(removeIndex, 1);
        company.save();
        client.remove();
        res.json({ msg: "Client Removed" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route PUT /api/client/update/:id
// @desc Update Client user
// @access Private
router.put('/api/client/update/:id', auth, async (req, res) => {
    // const requester = User.findById(req.user.id);
    if (req.client) {
        if (req.client.id !== req.params.id) {
            return res.status(401).json({ msg: "Not Authorized" });
        }
    }
    try {
        const client = Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ msg: "Client not found" });
        }
        const {
            name,
            email,
            active,
            avatar,
            phone
        } = req.body;
        const clientFields = {};
        if (name) clientFields.name = name;
        if (email) clientFields.email = email;
        if (active) clientFields.active = active;
        if (phone) clientFields.phone = phone;
        const clie = Client.findOneAndUpdate({ _id: req.params.id }, { $set: clientFields });
        await clie.save();
        return res.json({ msg: "Profile Updated" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;