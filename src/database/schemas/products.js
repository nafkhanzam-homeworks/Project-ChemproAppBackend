var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

// display products for user
var productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    kind: {
        book: Boolean,
        clothing: Boolean,
        alattulis: Boolean,
        required: true,
    }, 
    price:{
        type: Number,
        required: true,
    },
    description: String
}); {timestamps: true};


// creating a model
// var user = mongoose.model('users', userSchema);

module.exports = mongoose.model('products', productSchema);
