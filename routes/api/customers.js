const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const authemp = require('../../middleware/authemp');
const Customers = require('../../models/Customers');
const User = require('../../models/User');


// @route GET api/customers
// @desc Get all customers
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user.role.includes('User')) {
            return res.status(401).json({ msg: "Not authorized" });
        }
        if(!user.employee) {
            return res.status(401).json({ msg: "Not authorized" });
        }
        const customers = await Customers.find();
        res.json(customers);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});

// @route GET api/customers/search
// @desc Search customers
// @access Private
router.get('/search/:query', authemp, async (req, res) => {
    try {
        const customer = await Customer.find({ "company": { "$regex": req.params.query, "$options": 'i' } })
        // if (customer.length <= 0) {
        //     res.json({ msg: "customer not found" })
        // }
        res.json(customer)
    } catch (err) {
        console.log(err.message)
        res.status(500).json('Server Error')
    }
})

// @route GET api/customers/byid/:id
// @desc Get customer name by id
// @access Private
router.get('/byid/:id', auth, async (req, res) => {
    try {
        const customer = await Customers.findById(req.params.id).select('company');
        if(!customer) {
            return res.status(404).json({ msg: "Customer not found"})
        }
        return res.json(customer);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/customers/:id
// @desc Get customer by id
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const customer = await Customers.findOne({ custnumber: req.params.id })
        if (!customer) {
            return customer.status(404).json({ msg: "Customer not found" })
        }
        return res.json(customer)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})

// @route POST api/customers
// @desc Add customer
// @access Private
router.post('/', [authemp, [
    check('company', 'Company is required').not().isEmpty(),
    check('primaryphone', 'Phone Number is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { company } = req.body;
    const customer = await Customers.findOne({ company });
    if(customer) {
        return res.status(400).json({ errors: [{ msg: "Company already exists" } ] });
    }
    try {
        const lastCust = await Customers.findOne().sort({ custnumber: -1 }).limit(1);
        const { company, primaryphone, streetaddress, zipcode, usstate, city, primaryemail } = req.body;
        const newCustomer = new Customer({
            company: company,
            primaryphone: primaryphone,
            custnumber: lastCust.custnumber + 1,
            streetaddress: streetaddress,
            zipcode: zipcode,
            usstate: usstate,
            city: city,
            primaryemail: primaryemail
        });
        const customer = await newCustomer.save();
        res.json(customer);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/customers
// @desc Delete customer
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = User.findById(req.user.id);
        if(!user.role.includes('Admin')) {
            return res.status(401).json({ msg: "Not authorized" });
        }
        if(!user.employee) {
            return res.status(401).json({ msg: "Not authorized" });
        }
        const customer = Customers.findById(req.params.id);
        if(!customer){
            return res.status(404).json({ msg: "Customer not found" });
        }
        await customer.remove();
        res.json({ msg: "Customer Deleted"})
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Customer not found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route PUT api/customers/update/:id
// @desc Update Customer
// @access Private
router.put('/update/:id', auth, async (req, res) => {
    console.log(req.body)
    try {
        const company = await Customer.findOneAndUpdate({ custnumber: req.params.id}, req.body);
        if(!company) {
            return res.status(404).json({ msg: "Customer not found" });
        }
        return res.json(company);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Server Error");
    }
})

module.exports = router;