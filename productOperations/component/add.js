const fs=require('fs/promises');
const getAll=require("./getAll");
// product path
const add=async(data)=>{
   const newProduct={...data};
   const allProduct= await getAll();
   allProduct.push(newProduct);
// await fs.writeFile(contactsPath, JSON.stringify(allProduct,null,2));
return allProduct;
}
module.exports=add;