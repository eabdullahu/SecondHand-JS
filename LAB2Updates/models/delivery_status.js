const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const delivery_status_schema = mongoose.Schema({
    type: {
        type: String,
        enum: ["Opened", "Confirmed", "Shipped", "Delivered"],
        require: true,
        default: "Opened"    
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    }
});

module.exports = mongoose.model('DeliveryStatus', delivery_status_schema);