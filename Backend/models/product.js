const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: [3, 'Product name must be at least 3 characters long'],
        maxLength: [100, 'Product name must be less than 100 characters long'],
    },
    discription: {
        type: String,
        required: true,
        unique: true,
        minLength: [3, 'Product discription must be at least 3 characters long'],
       
    },
    image:{
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        enum: ['electronics', 'clothing', 'books', 'home', 'beauty', 'sports', 'toys'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number'],
    },
    
    
     isDeleted:{
        type:Boolean,
        select:false,
        default: false,
     }
}, {
     versionKey: false,
     timestamps: true
});
const Product = mongoose.model('Product', productSchema); 
// we dont write Priducts because mongoose will automatically convert it to plural and lowercase
//products is the name of the collection in the database and productschema is the blue print that i will validate the collection on
module.exports = Product;
