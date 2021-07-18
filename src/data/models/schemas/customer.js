const { Schema } = require('mongoose')

module.exports = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    surname: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    createdBy: {
        type: String,
        required: true
    },
    lastModifiedBy: {
        type: String,
        required: true
    },
})