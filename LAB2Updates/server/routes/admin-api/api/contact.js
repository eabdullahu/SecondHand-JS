const express = require('express');
const { sendMail } = require('../../../middleware/mail');

const router = express.Router();

router.post('/', async(req, res) => {
    try {
        console.log(req.body);
        sendMail('lezadashopthrift@gmail.com', "Contact Form Mail", "New contact form email.<br/><br/>From: " + req.body.from + "<br>Name: " + req.body.name + "<br> Subject: " + req.body.subject + "<br>Message: " + req.body.message);
        res.json({ msg: "Send" });
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;