const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order_schema = mongoose.Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    payment_type: { 
        type: String,
        enum: ["Cash", "CC"]
    },
    shipping_phone: {
        type: String,
        require: true
    },
    shipping_address: {
        type: String,
        require: true
    },
    shipping_city: {
        type: String,
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                require: true
            },
            price: {
                type: Number,
                require: true
            }
        }
    ],
    total: { // new 
        type: Number,
        require: true
    }, 
    status: { // new 
        type: String,
        ENUM: ["Initial", "Canceled", "Refunded", "Approved"],
        default: "Initial"
    },
    delivery_status: [ // new 
        {
            type: Schema.Types.ObjectId,
            ref: 'DeliveryStatus'
        }
    ],
    discount: { // new 
        type: Schema.Types.ObjectId,
        ref: 'Coupon'
    }
});

module.exports = mongoose.model('Orders', order_schema);