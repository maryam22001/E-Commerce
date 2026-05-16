const yup = require('yup');
const addProduct = yup.object({
    name: yup.string().required("name required").min(3,"min char is 3").max(20,"max char is 20"),
    description: yup.string().required("description required").min(3,"min char is 3").max(20,"max char is 20"),
category: yup.string().required("category required").min(3,"min char is 3").max(20,"max char is 20"),
Image: yup.string().required("image required").url("invalid url"),
price: yup.number().required("price required").positive("price must be positive")
    
})
module.exports=addProduct;