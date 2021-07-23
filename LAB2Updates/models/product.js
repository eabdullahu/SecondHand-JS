const { Mongos } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product_schema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [5, 'Minimun title length 5 characters']
    },
    desc: {
        type: String,
        required: false
    },
    posted_by: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    size: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        get: get_price,
        set: set_price,
        require: true
    },
    photos: [{
        photo_name: {
            type: String,
            required: true
        },
        photo_order: {
            type: Number,
            default: '1'
        }
    }],
    is_active: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity required'],
        min: [0, 'Minimun quantity is zero']
    },
    sale_status: {
        type: String,
        required: true,
        default: "NEW"
    },
    discount: {
        type: Number,
        get: get_price,
        set: set_price,
        min: 0,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reviews'
        }
    ],
    gender: {
        type: String,
        enum: ["F", "M", "U"]
    }
});


function get_price(num) {
    return (num / 100).toFixed(2);
}

function set_price(num) {
    return num * 100;
}

module.exports = mongoose.model('Product', product_schema);