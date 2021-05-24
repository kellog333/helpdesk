const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const Customers = require('../../models/Customers');
const Invitations = require('../../models/Invitations');
const authemp = require('../../middleware/authemp');
const authsuper = require('../../middleware/authsuper');
const authadmin = require('../../middleware/authadmin');

// @route GET api/user
// @desc Test Route
// @access Public
// router.get('/', auth, async (req, res) => {
//     res.send('User Route');
// });

// @route POST api/user
// @desc Create User
// @access Public for now but will be private
router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('phone', 'Phone Number is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('role', 'Role is required').not().isEmpty(),
    check('employee', 'Employee status is required').not().isEmpty()
], authadmin, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        name,
        email,
        phone,
        password,
        role,  
        employee
    } = req.body;
    try {
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ errors: [ { msg: "User already exists" } ]});
        }
        var newRole;
        console.log(role)
        switch(role){
            case "Super Admin":
                newRole = ['Super Admin', 'Admin', 'User', 'Customer'];
                break;
            case 'Admin':
                newRole = ['Admin', 'User', 'Customer'];
                break;
            case 'User':
                newRole = ['User', 'Customer'];
                break;
            default:
                newRole = ['Customer'];
        }

        user = new User({
            name,
            email,
            password,
            phone,
            role: newRole,
            employee
        });
        const salt = await bcrypt.genSalt(15);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        const payload = {
            user: {
                id: user.id,
            }
        }
        res.json({ msg: 'User Created'});
        // jwt.sign(
        //     payload,
        //     config.get('jwtSecret'),
        //     { expiresIn: 86400},
        //     (err, token) => {
        //         if(err) {
        //             throw err;
        //         }
        //         res.json({ msg: "User Created"});
        //     }
        // );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route GET api/users/employees
// @desc Get employees
// @access Private
router.get('/employees', authemp, async (req, res) => {
    try {
        const employees = await User.find({employee: {$eq: true}}).select('-password');
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route GET api/users/customers
// @desc Get customers
// @access Private
router.get('/customers', authemp, async (req, res) => {
    try {
        const customers = await User.find({employee: {$eq:false}}).select('-password');
        res.json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route GET api/users/byid/:id
// @desc Get user by id
// @access Private
router.get('/byid/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

// @route POST api/user/customer
// @desc Create User assigned to company
// @access Public
router.post('/customer',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('phone', 'Phone Number is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('role', 'Role is required').not().isEmpty(),
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
        role,
        invitation,  
    } = req.body;
    try {
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ errors: [ { msg: "User already exists" } ]});
        }
        let code = await Invitations.findOne({ invitecode: invitation });
        if(!code) {
            return res.status(401).json({ msg: "Invalid invitation code "});
        }
        let { company } = code;
        const employee = false;
        user = new User({
            name,
            email,
            password,
            phone,
            role,
            company,
            employee,
        });
        const salt = await bcrypt.genSalt(15);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        const payload = {
            user: {
                id: user.id,
            }
        }
        const compan = await Customers.findById(company);
        if(!compan){
            return res.status(404).json({ msg: "Company does not exist" })
        }
        const newUser = {
            user: user.id,
            name: name
        }
        compan.users.unshift(newUser);
        compan.save();
        code.remove();
        res.json({ msg: "User Created" })
        // jwt.sign(
        //     payload,
        //     config.get('jwtSecret'),
        //     { expiresIn: 86400},
        //     (err, token) => {
        //         if(err) {
        //             throw err;
        //         }
        //         res.json({ msg: "User Created"});
        //     }
        // );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router;