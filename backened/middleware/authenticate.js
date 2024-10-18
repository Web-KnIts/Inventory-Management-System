const asyncHandler = require('express-async-handler');
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');

const authenticate = asyncHandler(async(req,res,next)=>{
    const token = req.cookies.token  || req.headers['authorization'].split(' ')[1];
    console.log(token);
    if(!token)
    {
        res.status(400);
        throw new Error('Not authorized , Please Login');
    }
    const decode = await jwt.verify(token,process.env.JWT_SECRET);
    console.log(decode.id,"decode")
    const isUser = await User.findById(decode.id).select('-password');
    if(!isUser)
    {
        res.status(400);
        throw new Error('User not found');
    }
    if(!token)
    {
        res.status(400);
        throw new Error('Not authorized, please login');
    }
    req.user = isUser;
    next();
}) 

module.exports = authenticate;