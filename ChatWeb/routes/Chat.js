module.exports = app => {
    const chat = require("../controllers/Chat.js");
    var router = require("express").Router();

    router.post("/", chat.create);
    router.get("/:id", chat.findOne);
    
    app.use('/api/chat', router);
};