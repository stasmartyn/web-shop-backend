const {User,Role} =require("../models");
const bcrypt = require('bcryptjs');
const jwt =require("jsonwebtoken");
const {validationResult}=require("express-validator");
const {secret}=require("../authControler/config");

const generateAccessToken=(id,roles)=>{
const payload={
    id,
    roles
}
return jwt.sign(payload,secret,{expiresIn:"24h"})
}

class authController{
    async registration(req,res){
        try{
            const errors=validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({message:"registration error",errors});
            }
            const {userName,password}=req.body;
            const candidate=await User.findOne({userName});
            if(candidate){
                return res.status(400).json({message:"user already exists"});
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole= await Role.findOne({value:"USER"})
            const user=new User({userName,password:hashPassword,roles:[userRole.value]});
            await user.save();
            return res.json({message:"the user is succesfully registered"});
        }catch(error){
        console.log(error)
        res.status(400).json({message:'Register error'})
        } 
    }
    async login(req,res){
       try{
        const {userName,password}=req.body;
        const user=await User.findOne({userName});
        if(!user){
            return res.status(400).json({message:`user ${userName} not found`})
        }
        const validPassword=bcrypt.compareSync(password, user.password);
        if(!validPassword){
        return res.status(400).json({message:"paswword is not correct "})
        }
        const token =generateAccessToken(user._id,user.roles)
        const userRole=user.roles;
        res.json({token,userRole})

       } catch(error){
        console.log(error)
        res.status(400).json({message:'Login error'})

       }
    }
}
module.exports= new authController();