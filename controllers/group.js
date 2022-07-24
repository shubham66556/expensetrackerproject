const Group = require('../models/group');
const GroupTable = require('../models/grouptable');
const User = require('../models/user');
const {Op} = require('sequelize');
const Message = require('../models/message');


exports.createGroup = async (req,res,next) => {
    try {
        const userId = req.user.id;
        const {groupName,isAdmin} = req.body
        // console.log(groupName,isAdmin)
        const group = await Group.create({groupName})
        // console.log('this is response',group.dataValues.id)
        const groupId = group.dataValues.id;
        const groupname = group.dataValues.groupName;
        const grouptable = await GroupTable.create({isAdmin,groupId,userId})
        return res.status(201).json({message:`${groupname} is created with GroupID ${groupId}`,success:true})
    } catch (error) {
        return res.status(401).json({message:'something went wrorng',success:false,err:error})
    }
}

exports.addMember = async (req,res,next) => {
    try {
        let userId;
        let isAdmin = false;
        const {memberEmail,groupId} = req.body
        // console.log(memberEmail,groupId);
        const user = await User.findAll({where:{email:memberEmail}})
        if(!user.length>0){
            return res.status(403).json({message:'User does not exists!',success:false})
        }
        userId = user[0].dataValues.id;
        // console.log(userId, 'milgya user.....');
        const group = await Group.findByPk(groupId)
        // console.log(group);
        if(!group){
            return res.status(403).json({message:'Group does not exists!',success:false})
        }
        // console.log('milgya group bhai sahb');
        await GroupTable.create({isAdmin,groupId,userId})
        return res.status(201).json({message:'User Added To The Group',success:true})
    } catch (error) {
        return res.status(401).json({message:'Member is already in the group',success:false})
    }
}

exports.userGroup = async(req,res,next)=>{
    try {
        let allGrpId = [];
        const userId = req.user.id;
        const groupTable = await GroupTable.findAll({where:{userId}})
        // console.log(groupTable);
        if(!groupTable.length>0){
            return res.status(403).json({message:"Please Create Group",success:false})
        }
        groupTable.forEach(element => {
            allGrpId.push(element.dataValues.groupId);
        });
        // console.log(allGrpId);
            let allgroupName = await Group.findAll({where:{id:{[Op.or]:allGrpId}}})
            
        return res.status(200).json({allgroupName,success:true})
    } catch (error) {
        return res.status(403).json({message:"Please Create Group",success:false})
    }
}

exports.getGroupChat = async(req,res,next)=>{
    try {
        const groupId = req.query.id;
        const messages = await Message.findAll({where:{groupId}})
        return res.status(200).json({messages})
    } catch (error) {
        res.status(401).json({error})
    }
}

exports.postToGroup = async(req,res,next)=>{
    try {
        const senderName =  req.user.name
        const {message, groupId} = req.body;
        const messages = await req.user.createMessage({senderName,message,groupId});
        console.log(message);
        return res.status(201).json({messages,success:true})
    } catch (error) {
        res.status(402).json({error})
    }
}