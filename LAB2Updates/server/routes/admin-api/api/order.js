const express = require('express');
// const { is_auth, is_admin } = require('../../../../middleware/auth');
const order = require('../../../../models/order');
const { sendMail } = require('../../../../middleware/mail');
const users = require('../../../../models/user');
const delivery_status = require('../../../../models/delivery_status');
const mongoose = require('mongoose')
const router = express.Router();

// GET orders
router.get('/', async(req, res) => {
        try {

            limit = req.query.limit;
            page = req.query.page;
            const orders = await order.find().sort({"created_at": -1}).populate('client').populate('delivery_status').skip(parseInt(page)).limit(parseInt(limit));
            const total = await order.countDocuments();
            res.json({ "orders": orders, "total": total });

        } catch (error) {
            res.json({ message: error });
        }
    })
    //GET  specific order
router.get('/:order_id', async(req, res) => {
    try {
        const orders = await order.findById(req.params.order_id).populate('client').populate('products.product').populate('delivery_status');
        res.json(orders);
    } catch (error) {
        res.json({ message: error });
    }
});

//Get number of product for specific user
router.get('/user/:id', async(req, res) => {
    try {

        const clientNo = await order.find({ client: req.params.id }).countDocuments();
        console.log("RITA TEST");

        console.log(clientNo);
        res.json(clientNo);
    } catch (error) {
        res.json({ message: error });
    }
});

//Resend invoice to mail


router.post('/resend-invoice', async(req, res) => {
    try {

        const user = await users.findOne({ email: req.body.email });
        if (user != undefined) {
            sendMail(req.body.email, "Lezada Invoice", "Hello dear,<br><br> Please see attached invoice.<br>It is a pleasure serving you.<br> " + req.body.invoice + "<br><br> TEAM,<br> L E Z A D A.");
            res.json({ error: "Valid" });

        } else {
            res.json({ error: "Invalid" });
        }

    } catch (error) {
        console.log(error);
    }
});

//Update status

router.post('/updateStatus', async(req, res) => {
    try {
        var status = new delivery_status({
            type: req.body.status,
            updated_by: req.session.user._id,
        });
        await status.save();

        //Get last inserted document 
        const lastId = await delivery_status.find().limit(1).sort({ _id: -1 });

        //Update status to orderTable in db
        console.log(await order.updateMany({ _id: req.body.id }, { $push: { delivery_status: lastId[0]._id } }));
        res.json();
    } catch (error) {
        console.log("Rita error");

        res.json({ message: error });
    }
});



module.exports = router;