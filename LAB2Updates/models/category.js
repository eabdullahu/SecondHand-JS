const { Mongos } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const category_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: Number,
        required: false
    },
    order: {
        type: Number,
        default: '1',
        unique: true
    },
    photo_name: {
        type: String,
        required: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_under_homepage: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }]
});


module.exports = mongoose.model('Category', category_schema);