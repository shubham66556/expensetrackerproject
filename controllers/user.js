const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.userSignup = (req,res,next)=>{
    const {name,email,phone,password} = req.body;
    // console.log(name,"huhw");
    const saltround = 10;
    bcrypt.genSalt(saltround, function(err,salt){
        bcrypt.hash(password,salt, function(err,hash){
            if(err){
                // console.log(err)
                res.json({message:'Unable to create user'})
            }
            User.create({name,email,phone,password:hash})
            .then(response=>{
                res.status(201).json({message:"User Created Successfully..", success:true,response:response});
            })
            .catch(err=>{
                // console.log(err);
                res.status(403).json({message:"User already exists!Please Sign-in..",success:false,error:err})
            })
        })
    })
}


exports.userLogin = (req,res,next)=>{
    const {email,password} = req.body;
    User.findAll({where:{email}})
    .then(users=>{
        if(users.length>0){
            bcrypt.compare(password, users[0].password, function(err,response){
                if(err){
                    console.log(err)
                    return res.status(400).json({message:"Something went wrong!!",success:false})
                }
                if(response){
                    const jwtToken = generateToken(users[0].id)
                    return res.json({token:jwtToken,success:true,message:'Logged in Successfully'})
                }else{
                    return res.status(401).json({message:"Wrong password! Please enter correct password...!"})
                }
            })
        }
        else{
            return res.status(404).json({message:"User not found! Please signup",success:false,err});
        }
    })
    .catch(err=>{
        res.status(400).json({message:"User not found! Please signup",success:false,err});
    })
}

function generateToken(id){
    return jwt.sign(id, process.env.JWT_TOKEN_SECRET)
}