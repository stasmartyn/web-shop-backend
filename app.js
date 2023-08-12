const express = require('express');
const cors=require("cors");
const path=require('path');
const productRouters=require("./routers/routers")
require("dotenv").config();
const app=express();
app.use(express.json());



  app.use(cors());
app.use('/',productRouters);



app.use((err,req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const {status=500,message="Server error"}=err;
    res.status(status).json({message})
})
module.exports=app;
