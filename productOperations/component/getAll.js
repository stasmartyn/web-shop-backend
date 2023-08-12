const fs =require("fs/promises");
 const contactsPath=require("./contactsPath");
const getAll=async()=>{
    const data=await fs.readFile(contactsPath);
    const result=JSON.parse(data);
    return result;
}
module.exports=getAll;