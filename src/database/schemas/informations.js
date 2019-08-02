// defining schema
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var infosSchema = new Schema({
    funfact: String,
    schedule: String
});

// creating a model
// var user = mongoose.model('users', userSchema);
module.exports = mongoose.model('informations', infosSchema);