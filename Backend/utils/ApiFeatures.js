class ApiFeature{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
        this.limit=10; ///query string first if didint find the values specify the values
        this.page=1;
    }
   filter(){
    const queryObj={...this.queryStr}
    let excludeFields=["sort","page","limit","skip","fields","search"]
    excludeFields.forEach(el=>delete queryObj[el])
    console.log(queryObj)
    let queryStr=JSON.stringify(queryObj);
    queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
    this.query= this.query.find(JSON.parse(queryStr));
    console.log(JSON.parse(queryStr))
    return this;  
   }
   fields(){
    if(this.queryStr.fields){
        const fields=this.queryStr.fields.replace(","," ");
  
       this.query= this.query.select(fields);
    }else{
        this.query= this.query.select("-__v");
    }
    return this;

   }
   sort(){
    if(this.queryStr.sort){
        const sortBy=this.queryStr.sort.split(",").join(" ");
        this.query= this.query.sort(sortBy);
    }else{
        this.query= this.query.sort("-createdAt");//<<<<<<<<<<<<<<<<<<<<<<
    }
    return this;
   }
   search(){
    if(this.queryStr.search){
        const search=this.queryStr.search.replace(","," ");
        this.query= this.query.find({
            $or:[
                {name:{$regex:search,$options:"i"}},
                {description:{$regex:search,$options:"i"}}
            ]
        });
    }
    return this;
   }
   pagination(){
    let page=this.queryStr.page*1||1; // + 
    let limit=this.queryStr.limit*1||10;
    let skip=(page-1)*limit;
    this.query= this.query.skip(skip).limit(limit);
    return this;
   }
}
module.exports=ApiFeature;
