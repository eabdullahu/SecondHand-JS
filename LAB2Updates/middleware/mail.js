"use strict";
const nodemailer = require("nodemailer");
require('dotenv/config');
// async..await is not allowed in global scope, must use a wrapper
async function sendMail(mail_to, subject, message) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: process.env.FROM_MAIL, // sender address
        to: mail_to, // list of receivers
        subject: subject, // Subject line
        html: message, // html body
    });
}

module.exports = {
    sendMail
};