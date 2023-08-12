const { Schema, model, default: mongoose } = require("mongoose");
const productSchema =new Schema({
  title: String,
  img: Array,
  ram: Number,
  memory: Number,
  cpu: String,
  camera: String,
  description: String,
  price: Number,
  comments:[{type:Schema.Types.ObjectId, ref:'comment'}]
});
 const Product=model("Item",productSchema);
 module.exports=Product;
