const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Image = new Schema({
    name: {
        type: String,
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    }
})

module.exports = mongoose.model('Images', Image)