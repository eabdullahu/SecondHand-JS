const db = require("../models");
const Chat = db.Chat;
// const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const chat = {
        room_id: req.body.room_id,
        user_email: req.body.user_email,
        user_name: req.body.user_name,
        dis_reason: req.body.dis_reason,
        message: req.body.message
    };

    return Chat.findOne({ where: { room_id: chat.room_id } }).then(function (foundItem) {
        if (!foundItem) {
            return Chat.create(chat).then(data => { res.send(data); })
        }
        return Chat.update(chat, { where: { id: foundItem.id } }).then(data => { res.send(data); })
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Chat.findOne({ where: { room_id: id } }).then(data => {
        if(data){
            Chat.findAll({ where: { user_email: data.dataValues.user_email } }).then(data => {
                res.json(data); 
            });
        }
        console.log();
    }).catch(err => {
        res.status(500).send({
            message: err.message || "ERROR 501: Couldn't find chat with ID: " + id
        });
    });
};