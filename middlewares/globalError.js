const globalError=(err,req,res,next)=>{
  console.log(err)
   let error=err
   

  //  if(error.kind==="ObjectId")error=new AppError(a00,"Invalid ID")
    if (error.name == "CastError") error = new AppError(a00, "Invalid ID")
    if(error.code===11000) error= new AppError(400,'Duplicate Field Value Entered ${object.keys(error.keyValue).join(', '}') 
      if(error.name=="ValidationError"){
        const erors =Object.values(error.errors).map(err=>err.message).join(",")
        error=new AppError(erors,400)

      }
res.status(error.status||500).json({
    success:false,
    message:error.message||"Internal Server Error",
    stack : process.env.ENVIRONMENT==="development"?error.stack:""
})
}

module.exports=globalError