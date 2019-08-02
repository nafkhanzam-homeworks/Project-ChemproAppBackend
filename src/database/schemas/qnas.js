// defining schema
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var qnasSchema = new Schema({
    questions: { // from user
        // id: String, 
        username: String,
        question: String,
        id_question: String
        // required: true,
    },
    answers: { // from admin
        answer: String,
        id_answer: String, // or number
        given_answer: Boolean
        // required: true,
    }
});

// creating a model
// var user = mongoose.model('users', userSchema);
module.exports = mongoose.model('users', qnasSchema);