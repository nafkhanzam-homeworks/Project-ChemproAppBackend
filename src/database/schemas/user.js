//'use strict';

// defining schema
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    fullname: {
        first: String,
        last: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }, 
    username:{
        type: String,
        unique: true,
        required: true,
    },
    email: String,
    password: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
}); {timestamps: true}

// creating a model
// var user = mongoose.model('users', userSchema);

module.exports = mongoose.model('users', userSchema);

