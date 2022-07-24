const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateUser = (req,res,next)=>{
    const token = req.header('authanticate')
    // console.log(token, "auth");
    try {
        const userId = Number(jwt.verify(token,process.env.JWT_TOKEN_SECRET))
        // console.log(userId,'userid')
        User.findByPk(userId)
        .then(user=>{
            req.user = user;
            // console.log(user,"auth")
            next();
        })
        .catch(err=>{
            res.status(401).json({message:'Something went wrong', success:false})
        })
    } catch (error) {
        return res.status(401).json({message:'Something went wrong', success:false})
        
    }
}