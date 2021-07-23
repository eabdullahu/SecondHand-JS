const express = require('express');
const cities = require('../../../../models/city');


const router = express.Router();


router.get('/', async(req, res) => {
    try {
        const city = await cities.find();

        res.json(city);
    } catch (error) {
        res.json({ message: error });
    }



});

// GET cities
router.get('/:data', async(req, res) => {
    try {

        const request = JSON.parse(req.params.data);
        console.log(request);
        let filters = {};
        if (request.name != undefined) filters.name = { $regex: new RegExp(request.name, "i") };


        const count = await cities.find(filters).exec().then(t => t.length);
        const city = await cities.find(filters);

        res.json({ count: count, cities: city });
    } catch (error) {
        res.json({ message: error });
    }
});

// POST city
router.post('/', async(req, res) => {

    const new_city = new cities({
        zipcode: req.body.city.zipcode,
        name: req.body.city.name
    })

    try {
        const a_city = await new_city.save();
        res.json(a_city);
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const searched_cities = await cities.findById(req.params.id);
        res.json(searched_cities);
    } catch (error) {
        res.json({ message: error });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const removed_city = await cities.remove({ _id: req.params.id });
        res.json('success');
    } catch (error) {
        res.json({ message: error });
    }
});


router.patch('/:id', async(req, res) => {
    try {
        const updated = await cities.updateOne({ _id: req.body.city.id }, { $set: { name: req.body.city.name, zipcode: req.body.city.zipcode } });
        res.send("success");
    } catch (error) {
        updated
        res.json({ message: error });
    }
});


module.exports = router;