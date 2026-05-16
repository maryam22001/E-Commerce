const yup = require('yup');
const addProduct = yup.object({
    name: yup.string().required("name required").min(3,"min char is 3").max(100,"max char is 100"),
    discription: yup.string().required("discription required").min(3,"min char is 3").max(1000,"max char is 1000"),
category: yup.string().required("category required").min(3,"min char is 3").max(50,"max char is 50"),
image: yup.string().required("image required").url("invalid url"),
price: yup.number().required("price required").positive("price must be positive")
    
})
module.exports=addProduct;