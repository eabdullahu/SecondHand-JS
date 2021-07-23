const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    let response = await axios.get('http://localhost:6069/api/chat/' + id);
    response = response.data;
    console.log(response);
    
    response.splice(-1,1)
    console.log(response);
    const messages = [];
    response.map(item => {
        item.message.map(msg => {
            messages.push(msg)
        })
    });
    res.json(messages);
});

module.exports = router;