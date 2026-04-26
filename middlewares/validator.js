const validator=schema=>async (req,res,next)=>{
    try{
       
        const checkSchema =await schema.validate(req.body,{abortEarly:false });
        req.body=checkSchema;

       if(checkSchema) next();
    }catch(error){
        const err= error.errors.join(",")
        next(new AppError(error.message,400))
    }
}
module.exports=validator;