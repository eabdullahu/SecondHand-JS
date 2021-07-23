const express = require('express');
const { is_auth } = require('../../../middleware/auth');
const order = require('../../../models/order');
const user = require('../../../models/user');
const product = require('../../../models/product');
const delivery_status = require('../../../models/delivery_status');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose')
const router = express.Router();

// GET orders
router.get('/', is_auth, async(req, res) => {
    try {
        const orders = await order.find();
        res.json(orders);
    } catch (error) {
        res.json({ message: error });
    }
});
//GET user Orders

router.get('/myOrder', is_auth, async(req, res) => {
    try {
        const orders = await order.find({ client: req.session.user._id }).populate('delivery_status').sort('-date');
        res.json(orders);
    } catch (error) {
        res.json({ message: error });
    }
});



// POST order
router.post('/', async(req, res) => {
    try {

        var session_data = req.session.session_products;
        var order_products = [];
        session_data.forEach(function(item) {
            order_products.push({
                product: item,
                quantity: item.quantity,
                price: item.quantity * item.product.price
            })
        });

        var new_order;
        var ordered_by = null;
        if (req.body.id || req.session.user) {
            ordered_by = req.session.user;
        } else {
            const exists_user = await user.findOne({ email: req.body.user.email });
            if (exists_user == undefined) {
                var hash_password = bcryptjs.hashSync(req.body.user.password);
                const new_user = new user({
                    first_name: req.body.user.firstname,
                    last_name: req.body.user.lastname,
                    email: req.body.user.email,
                    phone: req.body.user.phone,
                    password: hash_password,
                    shipping_address: req.body.user.address
                });
                const added_user = await new_user.save();
                ordered_by = added_user;
            } else {
                return res.send("emailExists");
            }
        }

        new_order = new order({
            client: ordered_by,
            shipping_phone: req.body.shipping.phone,
            shipping_address: req.body.shipping.address,
            shipping_city: req.body.shipping.city,
            products: order_products,
            payment_type: req.body.shipping.payment_type,
            total: req.body.shipping.order_total - (req.session.coupon ? req.body.shipping.order_total * (req.session.coupon.discount / 100) : 0),
            //discount: req.session ? .coupon ? ._id
        })
        const added_order = await new_order.save();


        if (added_order._id) {
            session_data.forEach(async function(item) {
                await product.updateOne({ _id: item._id }, { $set: { quantity: (item.product.quantity - item.quantity) } });
            });

            const del_status = await new delivery_status({ updated_by: ordered_by }).save();
            await order.updateOne({ _id: added_order._id }, { $set: { delivery_status: del_status } })

            if (req.session.coupon) delete req.session.coupon;
            req.session.session_products = [];
            return res.send("accepted");
        } else {
            return res.send("error");
        }
    } catch (error) {
        res.json({ message: error });
    }
});

router.get('/:order_id', is_auth, async(req, res) => {
    try {
        await order.find({ client: req.session.user._id, _id: req.params.order_id }).populate({
            path: 'products.product',
            model: 'Product'
        }).populate('delivery_status').exec(function(err, result) {
            res.json(result);
        });
    } catch (error) {
        res.json({ message: error });
    }
});

router.delete('/:order_id', is_auth, async(req, res) => {
    try {
        const removed_order = await order.remove({ _id: req.params.order_id });
        res.json(removed_order);
    } catch (error) {
        res.json({ message: error });
    }
});

router.patch('/:order_id', is_auth, async(req, res) => {
    try {
        const updated = await order.updateOne({ _id: req.params.order_id }, { $set: { phone_2: req.body.phone_2 } });
        res.json(updated);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;