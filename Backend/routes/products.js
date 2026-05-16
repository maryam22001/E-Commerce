const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator.js');
const createProduct = require('../validations/addProduct.js');
const { GetAllProducts, getOneProduct, getDeletedProducts, getStatus, addProduct ,updateProduct,deleteProduct,softDeleteProduct} = require('../controllers/products.js');
router.route('/').get(GetAllProducts).post(validator(createProduct), addProduct);
//we pass the GetAllProducts method as a callback function to the route handler > when the route is called it will execute the GetAllProducts method and return the response to the client
//route ()> have the main rounte > /products and then we call the method that we want to execute when the route is called > in this case we want to get all the products so we call the GetAllProducts method   
//Router is a mini express application that we can use to define our routes and then we can use it in our main app.js file > this way we can keep our code organized and modular    
router.route('/deleted').get(getDeletedProducts); // Evaluate /deleted BEFORE /:id
router.route('/status').get(getStatus);
router.route('/softDeleted/:id').patch(softDeleteProduct);
router.route('/:id').get(getOneProduct).patch(updateProduct).delete(deleteProduct)

module.exports = router;
