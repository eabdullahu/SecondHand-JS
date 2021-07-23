const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const banner_content_schema = mongoose.Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    name: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: '1',
        unique: true
    },
    photo_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('BannerContent', banner_content_schema);