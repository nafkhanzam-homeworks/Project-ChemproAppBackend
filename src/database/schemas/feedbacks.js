//'use strict';
// defining schema
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
    // from users
    id_feedback: {
        type: String,
        required: true
    },
    feedbacks: {
        type: String,
        required: true
    }
}); 
// creating a model
// var user = mongoose.model('users', userSchema);
module.exports = mongoose.model('feedbacks', feedbackSchema);