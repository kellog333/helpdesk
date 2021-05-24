const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Tickets = require('../../models/Tickets');
const Client = require('../../models/Client');
const authemp = require('../../middleware/authemp');
const Customers = require('../../models/Customers');


// @route GET api/tickets
// @desc Get all not closed tickets
// @access Private
router.get('/', authemp, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const tickets = await Tickets.find({"status": {"$ne":"Closed"}});
        res.json(tickets)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//@route GET /api/tickets/mytickets/count
//@desc Get count of open tickets
//@access private
router.get('/mytickets/count', auth, async (req, res) => {
    try {
        const tickets = await Tickets.find({ assignedto: req.user.id, status: { "$ne": "Closed" } })
        return res.json(tickets.length)
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }
})

// @route GET /api/tickets/mytickets
// @desc Get your tickets
// @access Private
router.get('/mytickets', auth, async (req, res) => {
    const { pagenu } = req.body;
    try {
        if (req.clientee) {
            const tickets = await Tickets.find({ contact: req.clientee.id });
            return res.json(tickets);
        }
        if (req.user) {
            const tickets = await Tickets.find({ assignedto: req.user.id, status: { "$ne": "Closed" } })
            // .find({ "status": { "$ne": "Closed" } });
            return res.json(tickets);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }
})

// @route GET api/tickets/unassigned
// @desc Get unassigned tickets
// @access Private
router.get('/unassigned', authemp, async (req, res) => {
    try {
        const tickets = await Tickets.find({ "$or": [{ "assignedto": null }, { "assignedname": "In Queue" }] }).find({ "status": { "$ne": "Closed" } });
        if (!tickets) {
            return res.status(404).json({ msg: "No Tickets found" });
        }
        return res.json(tickets);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }
});

// @route GET api/tickets/customer/:id
// @desc Get ticket by customer
// @access Private
router.get('/customer/:id', auth, async (req, res) => {
    try {
        const customer = await Customers.findOne({ "custnumber": req.params.id });
        if (!customer) {
            return res.status(404).json({ msg: "Customer not found " });
        }
        const tickets = await Tickets.find({ "customer": customer._id });
        if (!tickets) {
            return res.status(404).json({ msg: "No Tickets Found" })
        }
        return res.json(tickets);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }
})

// @route Get api/tickets/:id
// @desc Get ticket by ticketnumber
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const ticket = await Tickets.findOne({ ticketnumber: req.params.id });
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket not found" });
        }
        res.json(ticket);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

// @route GET api/tickets/status/:status
// @desc Get Ticket by status
// @access Private
router.get('/status/:status', authemp, async (req, res) => {
    try {
        const tickets = await Tickets.find({ "status": { "$eq": req.params.status } })
        if (!tickets) {
            return res.status(404).json({ msg: "No Tickets found" })
        }
        return json(tickets)
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }
})




// @route DELETE api/ticket
// @desc Delete Ticket
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) {
            return res.status(401).json({ msg: 'Ticket does not exist' });
        }
        const user = await User.findById(req.user.id);
        if(!user.employee) {
            return res.status(401).json({ msg: "Not authorized" });
        }
        await Tickets.findOneAndUpdate(req.params.id, {archived: true} );
        res.json({ msg: "Ticket archived" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }
});

// @route POST api/ticket
// @desc Create Ticket
// @access Private
router.post('/', [auth, [
    check('contact', 'Contact is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty(),
    check('priority', 'Priority is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty()
]], async (req, res) => {
    try {
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const requester = await User.findById(req.user.id).select('-password');
        if(!requester) {
            const requester = await Client.findById(req.clientee.id).select('-password');
        }
        const {
            customer,
            contact,
            description,
            category,
            custnumber,
            status,
            priority,
            title,
            name,
            contactname,
            contactphone,
            contactemail,
        } = req.body;
        const lastTick = await Tickets.findOne().sort({ ticketnumber: -1 }).limit(1);
        if(!customer) {
            const userCont = await User.findById(contact).select('-password');
            const checkComp = await Customer.findById(userCont.company);
            if(!checkComp) {
                return res.status(404).json("Company not found");
            }
            const newTicket = new Tickets({
                company: userCont.company,
                name: checkComp.company,
                contactname: userCont.name,
                contact: userCont.id,
                contactphone: userCont.phone,
                contactemail: userCont.email,
                category: category,
                title: title,
                status: status,
                priority: priority,
                description: description,
                createdby: requester.id,
                timeon: newTime,
                ticketnumber: lastTick.ticketnumber + 1
            });
            const newTick = await newTicket.save()
            res.json(newTick);
        } else {
            const newTicket = new Tickets({
                customer: customer,
                name: name,
                contactname: contactname,
                customernumber: custnumber,
                contact: contact,
                contactphone: contactphone,
                contactemail: contactemail,
                category: category,
                title: title,
                status: status,
                priority: priority,
                description: description,
                createdby: requester.id,
                ticketnumber: lastTick.ticketnumber + 1
            });
            const newTick = await newTicket.save()
            res.json(newTick);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')    
    }
});

// @route PUT api/tickets/update/:ticket
// @desc Update Ticket
// @access Private
router.put('/update/:ticket', auth, async (req, res) => {
    try {
        const {
            category,
            status,
            priority,
            note,
            priv,
            assignedto,
            timeon
        } = req.body;
        let requester = await User.findById(req.user.id).select('-password');
        if(!requester){
            requester = await Client.findById(req.clientee.id).select('-password');
        }
        // Build object 
        const updates = {};
        if(category) updates.category = category;
        if(status) updates.status = status;
        if(priority) updates.priority = priority;
        if (timeon) {
            let tick = await Tickets.findOne({ "ticketnumber": req.params.ticket })
            let ticktime = tick.timeon;
            updates.timeon = ticktime + timeon
        }
        if (assignedto) {
            updates.assignedto = assignedto;
            const assname = await User.findById(assignedto);
            updates.assignedname = assname.name;
        }
        updates.lastmodified = Date.now();
        // Build notes
        const notesField = {};
        if (note) {
            notesField.notetaker = requester.name;
            notesField.text = note;
            notesField.priv = priv;
            notesField.time = timeon;
            let notee = await Ticket.findOneAndUpdate(
                { ticketnumber: req.params.ticket },
                { $push: { notes: notesField }}
            )
        }
        let ticket = await Tickets.findOneAndUpdate(
            { ticketnumber: req.params.ticket }, 
            { $set: updates },
        );
        await ticket.save()
        if(!ticket){
            return res.status(404).json({ msg: "Ticket not found" });
        }
        // await ticket.save();
        return res.json(ticket);

    } catch (err) {
        console.log(err.message);
        return res.status(500).json("Server Error");
    }

})

module.exports = router;