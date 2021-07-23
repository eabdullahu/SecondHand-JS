const express = require('express');
const { is_auth } = require('../../../middleware/auth');
const cities = require('../../../models/city');


const router = express.Router();

// GET cities
router.get('/', async(req, res) => {
    try {
        const cit = await cities.find();
        res.json(cit);
    } catch (error) {
        res.json({ message: error });
    }
});

// POST city
router.post('/', async(req, res) => {
    const new_city = new cities({
        zipcode: req.body.zipcode,
        name: req.body.name
    })

    try {
        const a_city = await new_city.save();
        res.json(a_city);
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

router.get('/:id', is_auth, async(req, res) => {
    try {
        const searched_cities = await cities.findById(req.params.id);
        res.json(searched_cities);
    } catch (error) {
        res.json({ message: error });
    }
});

router.delete('/:id', is_auth, async(req, res) => {
    try {
        const removed_city = await cities.remove({ _id: req.params.id });
        res.json(removed_city);
    } catch (error) {
        res.json({ message: error });
    }
});


router.patch('/:id', is_auth, async(req, res) => {
    try {
        const updated = await order.updateOne({ _id: req.params.id }, { $set: { name: req.body.name } });
        res.json(updated);
    } catch (error) {
        res.json({ message: error });
    }
});


module.exports = router;