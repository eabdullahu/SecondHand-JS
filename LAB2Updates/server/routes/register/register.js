const express = require('express');
const user = require('../../../models/user');
const bcryptjs = require('bcryptjs');

const router = express.Router();

// POST login
router.post('/', async(req, res) => {
    if (req.session.is_auth) {
        res.json("has session data!")
    } else {
        var hash_password = bcryptjs.hashSync(req.body.password);
        const userFound = await user.find({ email: req.body.email });
        if (userFound.length === 0) {
            const new_user = new user({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                phone: req.body.phone,
                password: hash_password,
                address: req.body.address,
                city: req.body.city
            });
            const saved_user = await new_user.save();
            res.json({ error: 0 });
        } else {
            res.json({ error: 1 });
        }
    }
});

module.exports = router;