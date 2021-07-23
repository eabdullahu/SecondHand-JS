const express = require('express');
const { is_auth } = require('../../../middleware/auth');
const coupon = require('../../../models/coupon');
const router = express.Router();

// GET coupons
router.get('/', is_auth, async(req, res) => {
    try {
        const coupons = await coupon.find();
        res.json(coupons);
    } catch (error) {
        res.json({ message: error });
    }
});

// POST coupon
router.post('/', is_auth, async(req, res) => {
    const new_coupon = new coupon({
        token: req.body.token,
        discount: req.body.discount,
        is_active: req.body.is_active,
        posted_by: req.body.posted_by
    })

    try {
        const add_coupon = await new_coupon.save();
        res.json(add_coupon);
    } catch (error) {
        res.json({ message: error });
    }
});

router.get("/hasCoupon", async(req, res) => {
    res.json(req.session.coupon ? req.session.coupon : null);
})

// GET coupon by token
router.get('/:token', async(req, res) => {
    try {
        const get_coupon = await coupon.findOne({ "is_active": true, "token": req.params.token });
        if (get_coupon) req.session.coupon = get_coupon;
        res.json(get_coupon);
    } catch (error) {
        res.json({ message: error });
    }
});

// DELETE coupon
router.delete('/:id', is_auth, async(req, res) => {
    try {
        const rf_coupon = await coupon.remove({ _id: req.params.id });
        res.json(rf_coupon);
    } catch (error) {
        res.json({ message: error });
    }
});

// UPDATE coupon
router.patch('/:id', is_auth, async(req, res) => {
    try {
        const up_coupon = await order.updateOne({ _id: req.params.id }, { $set: req.body.update });
        res.json(up_coupon);
    } catch (error) {
        res.json({ message: error });
    }
});


module.exports = router;