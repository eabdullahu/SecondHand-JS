const express = require('express');
const { is_auth } = require('../../../middleware/auth');
const banner_content = require('../../../models/banner_content');


const router = express.Router();

// GET content
router.get('/', async(req, res) => {
    try {
        const content = await banner_content.find().populate({
            path:  'category', 
            model: 'Category' 
        });
        res.json(content);
    } catch (error) {
        res.json({ message: error });
    }
});

// POST content
router.post('/', async(req, res) => {
    var new_content = new banner_content({
        name: req.body.name,
        category: req.body.category,
        order: req.body.order,
        photo_name: req.body.photo_name
    })

    try {
        const new_content2 = await new_content.save();
        res.json(new_content2);
    } catch (error) {
        res.json({ message: error });
    }
});

router.get('/:content', is_auth, async(req, res) => {
    try {
        const content = await banner_content.findById(req.params.content);
        res.json(content);
    } catch (error) {
        res.json({ message: error });
    }
});

router.delete('/:content', is_auth, async(req, res) => {
    try {
        const removed = await banner_content.remove({ _id: req.params.content });
        res.json(removed);
    } catch (error) {
        res.json({ message: error });
    }
});


router.patch('/:id', is_auth, async(req, res) => {
    try {
        const updated = await banner_content.updateOne({ _id: req.params.content }, { $set: { photo_name: req.body.photo_name } });
        res.json(updated);
    } catch (error) {
        res.json({ message: error });
    }
});


module.exports = router;