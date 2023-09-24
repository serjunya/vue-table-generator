const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entitySchema = new Schema ({
    // _id: {
    //     type: String,
    //     required: true
    // },
    _createUser: {
        type: String,
        required: true
    },
    _updateUser: {
        type: String,
        required: true
    },
    _createDt: {
        type: Date,
        required: true
    },
    _updateDt: {
        type: Date,
        required: true
    },
    Login: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Lang: {
        type: String,
        required: true
    },
    LoginsCount: {
        type: Number,
        required: true
    }
});

const Entity = mongoose.model('Entity', entitySchema);
module.exports = Entity;