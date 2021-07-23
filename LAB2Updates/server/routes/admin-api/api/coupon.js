const express = require('express');
// const { is_auth } = require('../../../middleware/auth');
const coupon = require('../../../../models/coupon');
const router = express.Router();

// GET couponss
router.get('/:data', async(req, res) => {
    try {
        const request = JSON.parse(req.params.data);
        console.log(request);
        let filters = {};
        if (request.token) filters.token = { $regex: new RegExp(request.token, "i") };
        if (request.status != "all") filters.is_active = request.status == 'true' ? true : false

        let usersFilters = {};
        if (request.postedby) {
            let name = request.postedby.split(" ");
            if (name[0]) usersFilters.first_name = { $regex: new RegExp(name[0], "i") };
            if (name[1]) usersFilters.last_name = { $regex: new RegExp(name[1], "i") };
        }

        const count = await coupon.find(filters).populate({ path: "posted_by", match: usersFilters }).exec().then(t => t.length);
        const coupons = await coupon.find(filters).skip(request.page).limit(request.toshow).populate({ path: "posted_by", match: usersFilters }).exec();
        // console.log({ count: count, coupons: coupons });
        res.json({ count: count, coupons: coupons });
    } catch (error) {
        res.json({ message: error });
    }
});

// POST coupon
router.post('/', async(req, res) => {
    const new_coupon = new coupon({
        token: req.body.coupon.token,
        discount: req.body.coupon.discount,
        is_active: req.body.coupon.status,
        posted_by: req.body.coupon.posted_by
    })

    try {
        const add_coupon = await new_coupon.save().then(t => t.populate('posted_by').execPopulate())
        res.json(add_coupon);
    } catch (error) {
        res.json({ message: error });
    }
});

// UPDATE coupon
router.patch('/:id', async(req, res) => {
    try {
        const cp = {
            discount: req.body.coupon.discount,
            is_active: req.body.coupon.status,
        };
        await coupon.updateOne({ _id: req.params.id }, cp);
        res.send("success");
    } catch (error) {
        res.json({ message: error });
    }
});

// DELETE coupon
router.delete('/:id', async(req, res) => {
    try {
        await coupon.deleteOne({ _id: req.params.id });
        res.send("success");
    } catch (error) {
        console.log("eRR", error)
        res.json({ message: error });
    }
});

module.exports = router;