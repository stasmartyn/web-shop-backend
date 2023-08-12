const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  userName:{type:String,unique:true},
  password:{type:String,required:true},
  roles:[{type:String, ref:"Role"}]
});
 const User=model("User",userSchema);
 module.exports=User;