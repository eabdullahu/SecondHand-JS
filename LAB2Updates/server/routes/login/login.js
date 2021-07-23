const express = require('express');
const users = require('../../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { sendMail } = require('../../../middleware/mail')
const { addMinutes, logout_user } = require('../../../middleware/auth');

const router = express.Router();

router.get('/room_and_user', (req, res) => {
    var room_id = req.session ?.chat ?.room_id;
    var chatUser = req.session ?.chat ?.user;
    var sess_user = req.session ?.user;
    if (sess_user ?._id) chatUser = { loggedin: true, name: sess_user.first_name + ' ' + sess_user.last_name, email: sess_user.email, role: 'user' };

    res.json({ room_id: room_id, user: chatUser });
})

// POST login
router.post('/', async(req, res) => {
    if (req.session.is_auth) {

        if (req.session.refresh_token != req.body.token) return res.send("valid session");

        res.json({ error: "has session" });
    } else {
        try {
            const user = await users.findOne({ email: req.body.email, role: 'user' });

            if (user) {

                const validPassword = await bcrypt.compare(req.body.password, user.password);
                if (validPassword) {
                    req.session.is_auth = true;
                    req.session.user = user;
                    const data = {

                        "phone": user.phone,
                        "address": user.address,
                        "role": user.role,
                        "_id": user._id,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "city": user.city,

                    }

                    const accessToken = generateAccessToken(data)

                    req.session.accesToken = accessToken;
                    if (!req.session ?.session_products)
                        req.session.session_products = [];
                    req.session.lastActivity = addMinutes(40);
                    res.json({ accessToken: accessToken, user: data })
                } else {
                    res.json({ error: "Invalid Password" });
                }
            } else {
                res.json({ error: "User does not exist" });
            }

        } catch (err) {
            res.json({ message123: err });
        }

    }
});


// POST ADMIN login
router.post('/admin', async(req, res) => {
    if (req.session.is_auth) {

        if (req.session.refresh_token != req.body.token) return res.send("valid session");

        res.json({ error: "has session" });
    } else {
        try {
            const user = await users.findOne({ email: req.body.email, role: 'admin' });

            if (user) {

                const validPassword = await bcrypt.compare(req.body.password, user.password);
                if (validPassword) {
                    req.session.is_auth = true;
                    req.session.user = user;
                    const data = {

                        "phone": user.phone,
                        "address": user.address,
                        "role": user.role,
                        "_id": user._id,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "city": user.city,

                    }

                    const accessToken = generateAccessToken(data)

                    req.session.accesToken = accessToken;
                    if (!req.session ?.session_products)
                        req.session.session_products = [];
                    req.session.lastActivity = addMinutes(40);
                    res.json({ accessToken: accessToken, user: data })
                } else {
                    res.json({ error: "Invalid Password" });
                }
            } else {
                res.json({ error: "User does not exist" });
            }

        } catch (err) {
            res.json({ message123: err });
        }

    }
});

router.post('/reset-password', async(req, res) => {
    try {
        var hash_password = bcrypt.hashSync(req.body.password);
        await users.updateOne({ _id: req.body.user }, { password: hash_password, password_reset_token: '', reset_token_expired_at: '' })
        res.json({ message: 0 });
    } catch (error) {
        console.log(error);
    }
});

router.patch('/reset-password', async(req, res) => {
    try {
        const user = await users.findOne({ email: req.body.email });
        if (user != undefined) {
            random_token = require('crypto').randomBytes(32).toString('hex');

            var date = new Date();
            date.setDate(date.getDate() + 1);

            await users.updateOne({ _id: user._id }, { password_reset_token: random_token, reset_token_expired_at: date })

            sendMail(req.body.email, "Reset your password", "Pershendetje,<br><br>Kerkesa juaj per te nderruar fjalekalimin eshte miratuar.<br><br>Ju lutem klikoni ne linkun: <a href=\"http://localhost:8080/forgetPassword/" + random_token + "\"> ketu </a><br><br><br>Gjithe te mirat, <br>L E Z A D A  ")

            res.json({ error: "valid user" });

        } else {
            res.json({ error: "invalid user" });
        }
    } catch (error) {
        console.log(error);
    }
});
//Check if password page is ok
router.post('/check-pass', async(req, res) => {
    try {
        const user = await users.findOne({ password_reset_token: req.body.password_reset_token, reset_token_expired_at: { $gte: new Date().getDate() } });
        if (user != undefined) {
            res.json({ message: 'true', user: user });
        } else {
            res.json({ message: 'false' });
        }
    } catch (error) {
        console.log(error);
    }
});

router.delete('/', (req, res) => {
    logout_user(req);
    res.sendStatus(204)
})

router.get('/session-products', (req, res) => {
    res.json(req.session.session_products);
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

module.exports = router;