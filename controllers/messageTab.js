const User = require('../models/user');
const Message = require('../models/message');
const {Op} = require('sequelize')


exports.getUser = (req,response,next)=>{
    // const loggedInUser = req.user.name;
    let allUser = [];
    // console.log(loggedInUser);
    User.findAll()
    .then(users=>{
        users.forEach(user => {
            allUser.push(user.name)
        })
        return response.status(200).json({listOfUser:allUser});
    })
    .catch(err=>{
        return response.status(402).json({message:"Wrong path", success:false})
    })
}

exports.postMessage = (req,res,next)=>{
    const senderName =  req.user.name
    const {message} = req.body;
    console.log(message,senderName);
    req.user.createMessage({senderName,message})
    .then(msg=>{
        return res.status(201).json({msg,success:true})
    })
    .catch(err=>{
        return res.status(403).json({err,success:false})
    })
}

exports.getMessage = async (req,res,next)=>{
    try {
        const mid = req.query.id;
        const messages = await Message.findAll({where:{id:{[Op.gte]:mid},groupId:null}})
        res.status(200).json({messages})
    } catch (error) {
        res.status(401).json({error})
    }    
}