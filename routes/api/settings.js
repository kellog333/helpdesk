const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Categories = require('../../models/Categories');
const Statuses = require('../../models/Statuses');
const Priorities = require('../../models/Priorities');
const Settings = require('../../models/Settings');
const authemp = require('../../middleware/authemp');
const authadmin = require('../../middleware/authadmin');


// @route GET api/settings/categories
// @desc Get categories
// @access Private
router.get('/categories', auth, async (req, res) => {
    try {
        const categories =  await Categories.find();
        res.json(categories);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});

// @route GET api/settings/statuses
// @desc Get statuses
// @access Private
router.get('/statuses', auth, async (req, res) => {
    try {
        const statuses =  await Statuses.find();
        res.json(statuses);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});

// @route GET api/settings/priorities
// @desc Get priorities
// @access Private
router.get('/priorities', auth, async (req, res) => {
    try {
        const priorities =  await Priorities.find();
        res.json(priorities);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});

// @route POST api/settings/categories
// @desc Add categories
// @access Private
router.post('/categories', [ authadmin, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;
    const cat = await Categories.findOne({ text });
    if(cat) {
        return res.status(400).json({ errors: [{ msg: "Category already exists" } ] });
    }
    try {
        const newCategory = new Categories({
            text: req.body.text
        });
        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route POST api/settings/statuses
// @desc Add statuses
// @access Private
router.post('/statuses', [ authadmin, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;
    const stat = await Statuses.findOne({ text });
    if(stat) {
        return res.status(400).json({ errors: [{ msg: "Status already exists" } ] });
    }
    try {
        const newStatus = new Statuses({
            text: req.body.text
        });
        const status = await newStatus.save();
        res.json(status);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route POST api/settings/priorities
// @desc Add priorities
// @access Private
router.post('/priorities', [ authadmin, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;
    const priority = await Priorities.findOne({ text });
    if(priority) {
        return res.status(400).json({ errors: [{ msg: "Priority already exists" } ] });
    }
    try {
        const newPriority = new Priorities({
            text: req.body.text
        });
        const priority = await newPriority.save();
        res.json(priority);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route DELETE api/settings/priorities
// @desc Remove priorities
// @access Private
router.delete('/priorities/:id', authadmin, async (req, res) => {
    try {
        const priority = await Priorities.findById(req.params.id);
        if(!priority) {
            return res.status(404).json({ errors: [{ msg: "Priority does not exists" } ] });
        }
        await priority.remove();
        res.json({ msg: 'Priority removed'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route DELETE api/settings/statuses
// @desc Remove statuses
// @access Private
router.delete('/statuses/:id', authadmin, async (req, res) => {
    try {
        const status = await Statuses.findById( req.params.id );
        if(!status) {
            return res.status(404).json({ errors: [{ msg: "Status does not exists" } ] });
        }
        await status.remove();
        res.json({ msg: 'Status removed'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route DELETE api/settings/categories
// @desc Remove categories
// @access Private
router.delete('/categories/:id', authadmin, async (req, res) => {
    try {
        const category = await Categories.findById( req.params.id );
        if(!category) {
            return res.status(404).json({ errors: [{ msg: "Category does not exists" } ] });
        }
        await category.remove();
        res.json({ msg: 'Category removed'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route POST api/settings
// @desc Add Setting
// @access Private
router.post('/', authadmin, [
    check('setting', 'Setting is required').not().isEmpty(),
    check('value', 'Value is required').not().isEmpty()
    ], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { setting, value } = req.body;
    try {
        const setting = await Settings.find({ ref: setting });
        if(!setting){
            const newSetting = new Setting({
                ref: setting,
                value: value
            })
            const doneSet = newSetting.save();
            res.json(doneSet);
        } 
        const sett = await Setting.findOneAndUpdate(
            {ref: setting},
            {value: value}
            );
        return res.json(sett);
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});

// @route GET api/settings
// @desc Get Setting
// @access Public
router.get('/', async (req,res) => {
    const { setting } = req.body;
    try {
        const setting = Setting.findOne({ ref: setting });
        res.json(setting);
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;