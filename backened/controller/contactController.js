require('dotenv').config();
const asyncHandler = require('express-async-handler');
const User = require('../models/userSchema');
const sendEmail = require('../utils/sendEmail');

// Contact Us - email : (need to test)
// step 1: fetch data from body {subject,message};
// step 2: validate user
// step 3: send email
// step 4: send response
const contactUs = asyncHandler(async(req,res)=>{
    const {subject,message} = req.body;
    const user_id = req.user._id;

    if(!user_id)
    {
        res.status();
        throw new Error('User details not found');
    }

    if(!subject || !message)
    {
        res.status()
        throw new Error('Email required fields not found');
    }

    const send_to = process.env.HOST_EMAIL;
    const sent_from = process.env.HOST_EMAIL;
    const replyTo = req.user.email;
    
    try{
        await sendEmail(subject,message,send_to,sent_from,replyTo);
        res.status(200).json({
            success:true,
            message:"Email Sent"
        })
    }catch(err)
    {
        res.status(500);
        throw new Error('Email not sent, please try again');
    }

})

module.exports = contactUs;