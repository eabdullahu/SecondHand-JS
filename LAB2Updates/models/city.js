const { Mongos } = require('mongodb');
const mongoose = require('mongoose');

const city_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('City', city_schema);