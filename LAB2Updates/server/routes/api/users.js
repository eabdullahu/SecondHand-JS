const express = require('express');
const mongodb = require('mongodb');
const user = require('../../../models/user');
const { is_auth } = require('../../../middleware/auth');
const bcryptjs = require('bcryptjs');


const router = express.Router();

// GET users
router.get('/', is_auth, async(req, res) => {
    try {
        const users = await user.find();
        res.json(users);
    } catch (error) {
        res.json({ message: error });
    }
});

// POST users
router.post('/', is_auth, async(req, res) => {

    var hash_password = bcryptjs.hashSync(req.body.password);

    const new_user = new user({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        password: hash_password,
        shipping_address: req.body.shipping_address
    });
    try {
        const saved_user = await new_user.save();
        res.json(saved_user);
    } catch (error) {
        res.json({ message: error });
    }
});

router.get('/:user_id', is_auth, async(req, res) => {
    try {
        const searched_user = await user.findById(req.params.user_id);
        const returnUser = {
            first_name: searched_user.first_name,
            last_name: searched_user.last_name,
            email: searched_user.email,
            phone: searched_user.phone,
            shipping_address: searched_user.shipping_address
        }

        res.json(returnUser);
    } catch (error) {
        res.json({ message: error });
    }
});

router.delete('/:user_id', is_auth, async(req, res) => {
    try {
        const removed_user = await user.remove({ _id: req.params.user_id });
        res.json(searched_user);
    } catch (error) {
        res.json({ message: error });
    }
});

router.patch('/:user_id', is_auth, async(req, res) => {
    var has_permission = false;
    if (req.session.role == "Admin") {
        has_permission = true;
    } else if (req.params.user_id == req.session.user.user_id) {
        has_permission = true;
    }
    if (req.body.update_profile == true) {
        try {
            await user.updateOne({ _id: req.params.user_id }, { $set: { first_name: req.body.first_name, last_name: req.body.last_name, shipping_address: req.body.shipping_address, phone: req.body.phone, city: req.body.city } });
            const updated_user = await user.findById(req.params.user_id);
            const returnUser = {
                id: updated_user._id,
                first_name: updated_user.first_name,
                last_name: updated_user.last_name,
                email: updated_user.email,
                phone: updated_user.phone,
                shipping_address: updated_user.shipping_address,
                city: updated_user.city
            }

            res.json(returnUser);
        } catch (error) {
            res.json({ message: error });
        }
    } else {
        try {

            const current_user = await user.findOne({ _id: req.params.user_id });
            if (req.body.password == req.body.new_password) {
                res.json({ error: "error0", message: "Your new password is same as the old one" })
                return;
            }
            const validPassword = await bcryptjs.compare(req.body.password, current_user.password);
            if (validPassword == true) {

                var hash_password = bcryptjs.hashSync(req.body.new_password);
                const update = await user.updateOne({ _id: req.params.user_id }, { $set: { password: hash_password } });
                res.json({ message: "Password changed successfully!" })
            } else {
                res.json({ error: "error1", message: "Old password is wrong!" })

            }

        } catch (error) {
            res.json({ message: error });
        }
    }

});


module.exports = router;