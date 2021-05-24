const express = require('express');
const router = express.Router();
const { check, validationResults } = require('express-validator');
const randomstring = require('randomstring');
const Invitations = require('../../models/Invitations');


// @route GET api/stats
// @desc Test Route
// @access Public
router.get('/', async (req, res) => {
    const newString = await randomstring.generate();
    const newInvitation = new Invitations({
        company: "60221b05d40f9aa2526cad06",
        invitecode: newString,
    })
    newInvitation.save();
    res.send(newInvitation);
});

module.exports = router;