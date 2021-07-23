const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    email_verify_token: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: true
    },
    password_reset_token: {
        type: String,
        default: null
    },
    reset_token_expired_at: {
        type: Date,
        default: null
    },
    is_active: {
        type: Boolean,
        default: true
    },
    address: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        require: true
    }
});

module.exports = mongoose.model('Users', user_schema);