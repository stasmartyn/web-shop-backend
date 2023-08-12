const { Schema, model, default: mongoose } = require("mongoose");
const cartSchema =new Schema({
 user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
 },
 product:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Item",
 },
],
});
 const Cart=model("Cart",cartSchema);
 module.exports=Cart;
