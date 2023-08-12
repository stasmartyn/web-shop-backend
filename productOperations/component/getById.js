// const getAll=require("./getAll");
const getById=async(id)=>{
const product=await getAll();
const result=product.find(item=>item.id===id);
if(!result){
    return null;
}
return result;
}
module.exports=getById;