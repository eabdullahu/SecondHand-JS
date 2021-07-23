const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const review_schema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    posted_by: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    rated: {
        type: Number,
        min: 1,
        max: 5,
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reviews', review_schema);