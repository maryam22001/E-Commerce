const Product = require('../models/product.js');
const ApiFeature = require('../utils/ApiFeatures.js');
const catchAsync = require('../utils/catchAsync.js');

exports.GetAllProducts = catchAsync( async (req, res) => {
         const feature = new ApiFeature(Product.find({ isDeleted: false }), req.query).filter().fields().sort().search().pagination();  
          console.log(req.query)
        //Product > model name
        const products = await feature.query;
        const procuctsCount = await Product.countDocuments();
        res.status(200).json({ 
            success: true,
            results: products.length,
            count: procuctsCount,
            limit: feature.limit,
            page: Math.ceil(procuctsCount / feature.limit),
            data: products
            
        });
    
});

exports.getOneProduct = catchAsync( async (req, res, next) => {

        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) {
            return res.status(404).json({ success: false, message: 'Product not found' });
       
        res.status(200).json({ success: true, data: product });

    
       /// status(500).json({ success: false, message: error.message });
     
    }
});

exports.getDeletedProducts = catchAsync( async (req, res, next) => {
   
        const products = await Product.find({ isDeleted: true }).select('isDeleted');   
        res.status(200).json({ success: true, data: products });
    
});
exports.getStatus = catchAsync( async (req, res, next) => {
   
        const status = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                    topProduct: { $first: "$ROOT" }
                }
            }
        ]);
        res.status(200).json({ success: true, data: status });
    
});
exports.addProduct = catchAsync( async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
});
exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate({_id:req.params.id,isDeleted:false},{...req.body,updatedAt:Date.now()},{runValidators:true,new:true},{returnDocument:'after'});
    //issue return the old product not the updated one > to return the updated one we can pass an option to the findByIdAndUpdate method > {new: true} > this will return the updated product instead of the old one
   //add runvalidators: true to run the validators on the update > this will ensure that the data is valid before updating the product
    //returnDocument : 'after' is the new option that replaces new: true in mongoose 6 > this will return the updated product instead of the old one
    //incase he didnt find the product > this needs to be  handled 
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found to update with id ${req.params.id}' });
    }

   //findByIdAndUpdate vs findOneAndUpdate > findByIdAndUpdate is a shorthand for findOneAndUpdate with the _id field
    res.status(200).json({ success: true, data: product });
});

exports.deleteProduct = catchAsync( async (req, res, next) => {
    const product = await Product.findOneAndDelete({_id:req.params.id,isDeleted:false});
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found to delete with id ${req.params.id}' });
    }
    res.status(204).send();

});

exports.softDeleteProduct = catchAsync( async (req, res, next) => {
    const product = await Product.findByIdAndUpdate({_id:req.params.id,isDeleted:false},{isDeleted:true,updatedAt:Date.now()},{runValidators:true,new:true},{returnDocument:'after'});
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found to delete with id ${req.params.id}' });
    }
    res.status(200).json({ success: true, data: product });
});