const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const randomstring = require('randomstring');
const Invitations = require('../../models/Invitations');
const nodemailer = require('nodemailer');
const auth = require('../../middleware/auth');
const config = require('config');
const Email = require('email-templates');
const path = require('path');
const User = require('../../models/User');
const authemp = require('../../middleware/authemp');


// @route GET api/invitations
// @desc Test Route
// @access Public
// router.get('/', async (req, res) => {
//     const newString = await randomstring.generate();
//     const newInvitation = new Invitations({
//         company: "60221b05d40f9aa2526cad06",
//         invitecode: newString,
//     })
//     newInvitation.save();
//     res.send(newInvitation);
// });

// @route POST api/invitations
// @desc Create invitation and send email
// @access Private
router.post('/', [authemp,[
    check('email','Invalid Email').isEmail(),
    check('company','Company is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
    }
    try{
        const {
            company,
            email
        } = req.body;
        const newString = await randomstring.generate();
        const newInvitation = new Invitations({
            company: company,
            invitecode: newString
        })
        newInvitation.save();
        // const transporter = nodemailer.createTransport({
        //     host: config.get('smtpHost'),
        //     port: config.get('smtpPort'),
        //     auth: {
        //         user: config.get('smtpUser'),
        //         pass: config.get('smtpPass')
        //     }
        // });
        // const emailer = new Email({
        //     message: {
        //         from: 'support@lighthousetechs.net'
        //     },
        //     // send: true,
        //     transport: transporter
        // });
        // emailer.send({
        //     template: path.join(__dirname, 'emails/invite'),
        //     message: {
        //         to: email
        //     },
        //     locals: {
        //         name: email,
        //         invitecode: newString.toString()
        //     }
        // })
        // res.json({ msg: 'Invitation sent'})
        res.json(newInvitation);
    } catch(err){
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;