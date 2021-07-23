const express = require('express');
const { is_auth } = require('../../../middleware/auth');
const user = require('../../../models/user');
const product = require('../../../models/product');
const review = require('../../../models/review');
const mongoose = require('mongoose')
const router = express.Router();

// Add new reivew for single product
router.post('/', is_auth, async(req, res) => {
    try {
        var new_review = new review({
            title: req.body.title,
            desc: req.body.desc,
            posted_by: req.session.user,
            product: req.body.product_id,
            rated: req.body.rated
        });

        const added = await new_review.save().then(added => added.populate('posted_by').execPopulate());
        if (added._id) return res.send(added);
        else return res.send("error");
    } catch (error) {
        res.json({ message: error });
    }
});

// Get reviews of a product.
router.get('/:product_id', async(req, res) => {
    try {
        const reviews = await review.find({ product: req.params.product_id }).populate("posted_by").sort({ _id: -1 });
        res.json(reviews);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;