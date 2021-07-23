const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const coupon_schema = mongoose.Schema({
    token: {
        type: String,
        require: true,
        unique: true
    },
    discount: {
        type: Number,
        require: true
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    posted_by: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    times_used: {
        type: Number,
        default: 0,
        require: false
    }
});

module.exports = mongoose.model('Coupon', coupon_schema);