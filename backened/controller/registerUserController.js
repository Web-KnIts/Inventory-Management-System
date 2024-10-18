const User = require('../models/userSchema');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Token = require('../models/tokenSchema.js');
const sendMail = require('../utils/sendEmail.js');

const generateToken = (id)=>{
    return jwt.sign({
        id:id,
    },process.env.JWT_SECRET,{expiresIn:'1d'});
}

const cookie_Option =(validate)=> {
    const date = validate === true? new Date(Date.now() + 1000 * 24*60*60):new Date(0);
    return {
    path:'/',
    httpOnly:true,
    expiresIn:date,
    secure:true,
    }
} 

const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password,phone_number} = req.body
    if(!name || !email || !password || !phone_number)
    {
        res.status(400);
        throw new Error ('please fill in all required fileds');
    }
    if(password.length < 6)
    {
        res.status(400);
        throw new Error('Password must be upto 6 char');
    }

    const isUser = await User.findOne({email});
    if(isUser !== null)
    {
        res.status(400);
        throw new Error('User already exists , Login');
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);

    const createUser =await User.create({
        name:name,
        email:email,
        password:hashPassword,
        phone_number:phone_number
    });

    const token = generateToken(createUser._id);
    if(createUser)
    {
        res.cookie('token',token,cookie_Option(true)).status(201).json({
            success:true,
            data:{
                _id:createUser._id,
                name:createUser.name,
                email:createUser.email,
                phone_number:createUser.phone_number,
                profile_picture:createUser.profile_picture,
                bio:createUser.bio,
            },
          token
        })
    }
    else
    {
        res.status(400);
        throw new Error('Invaild user Data')
    }
})

// Login User : 
// 1. get data
// 2. validate user
// 3. chk user existance
// 4. compare password
// 5. generateToken
// 6. send response

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password)
    {
        res.status(400);
        throw new Error('Email or password field is Empty');
    }
    const isUser = await User.findOne({email:email});
    if(!isUser)
    {
        res.status(404);
        throw new Error('User not found, please register first');
    }
    const isCorrectPass = await bcrypt.compare(password,isUser.password);
    if(!isCorrectPass)
    {
        res.status(400);
        throw new Error('Password not Matched or Invalid Email');
    }
    const token = generateToken(isUser._id);
    if(isUser && isCorrectPass)
    {
        const {_id,name,email,phone_number,profile_picture,bio} = isUser;
        res.cookie('token',token,cookie_Option(false)).status(200).json({
            success:true,
            data:{
            _id,name,email,phone_number,profile_picture,bio
            },
            token
        })
    }
})

// loginStatus :
// step 1: get Token
// step 2: validate token
// step 3: return data 
const loginStatus = asyncHandler((req,res)=>{
    const token = req.cookies.token;
    if(!token)
    {
        return  res.status(400).json({
            success:false,
            message:"token missing"
        })
    }
    const validToken = jwt.verify(token,process.env.JWT_SECRET);
    if(validToken)
    {
        return res.status(200).json({
            success:true,
            message:"token validated",
            user_id:validToken
        })
    }
    return res.status(400).json({
        success:false,
        message:"Token invalid"
    })
})  

// logout user : 
const logout = asyncHandler(async(req,res)=>{
    return res.cookie("token",'',cookie_Option(false)).status(200).json({
        success:true,
        message:"Logged Out successfully"
    })
})

// get user Details : 
const getUser = asyncHandler(async(req,res)=>{
    const isUser = await User.findById(req.user.id).select("-password");
    console.log(isUser);
    if(isUser)
    {
        const {_id,name,email,profile_picture,phone_number,bio} = isUser;
        return res.status(200).json({
            success:true,
            message:"user details fetched successfully",
            data:{
                _id,name,email,profile_picture,phone_number,bio
            }
        })
    }
    else
    {
        res.status(400)
        throw new Error('User details not found');
    }
})


// update user : (need to test)
// step 1: get user to update
// step 2: find user
// step 3: get updated user details 
// step 4: update into db
// step 5: return response
const updateUser = asyncHandler(async(req,res)=>{
    const {name,email,profile_picture,bio,phone_number,_id} = req.user;
    if(_id)
    {
        const updatedUser = await User.findByIdAndUpdate({_id:_id},{
            name:req.body.name || name,
            email:req.body.email || email,
            profile_picture:req.body.profile_picture || profile_picture,
            bio: req.body.bio || bio,
            phone_number:req.body.phone_number || phone_number
        },{new:true}).select('-password');

        if(!updatedUser)
        {
            res.status(400)
            throw new Error('Faild to update user')
        }

        return res.status(200).json({
            success:true,
            message:"User Updated Successfully",
            data:{
                name:updatedUser.name,
                email:updatedUser.email,
                profile_picture:updatedUser.profile_picture,
                bio:updatedUser.bio,
                phone_number:updatedUser.phone_number
            }
        })
    }
    res.status(404)
    throw new Error('User Not Found')

})

// change Password : 
// 1. get old and new password of user;
// 2. check user 
// 3. update user if old pass matches pass in db

const changePassword = asyncHandler(async(req,res)=>{
    const id = req.user.id;
    const {oldpassword,newpassword} = req.body;
    if(!id)
    {
        res.status(400);
        throw new Error('User details not found due to invalid id');
    }

    if(!oldpassword || !newpassword) 
    {
        res.status(400);
        throw new Error('some fields found empty');
    }

    const userDetails = await User.findById(id);
    const matchPassword = await bcrypt.compare(oldpassword,userDetails.password);
    const hashPassword = await bcrypt.hash(newpassword,10);
    if(matchPassword)
    {
        userDetails.password = hashPassword;
        await userDetails.save();
         res.status(200).json({
            success:true,
            message:"Password changed successfully"
        })
    }
    else
    {
        res.status(400);
        throw new Error('Faild to update password');
    }
})


// Forget Password : 
// 1. get data
// 2. validate user
// 3. delete previous token first
// 4. reset token and store it into database;
// 5. generate frontend url 
// 6. sending a link to the mail for reset route;
const foregetPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body;

    if(!email){
        res.status(400);
        throw new Error('Email not found');
    }

    const userDetails = await User.findOne({email});

    if(!userDetails)
    {
        res.status(400);
        throw new Error('User not found with the provided mail')
    }

    const isToken = await Token.findOne({userId:userDetails._id});
    if(isToken)
    {
        await isToken.deleteOne();
    }

    const generateResetToken = crypto.getRandomValues(32).toString('hex')+userDetails._id;
    const hashResetToken = crypto.createHash('sha256').update(generateResetToken).digest('hex');4

    const saveResetToken = await Token.create({
        userId:userDetails._id,
        token:hashResetToken,
        createdAt:Date.now(),
        expiredAt:Date.now() + 30*60*1000
    })
    console.log(saveResetToken)

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${generateResetToken}`;

    const message = `
     <h2>Hello ${user.name}</h2>
      <p>Please use the url below to reset your password</p>  
      <p>This reset link is valid for only 30 minutes.</p>

      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

      <p>Made with Love by Laxshay</p>
    `;
    const subject = 'Reset Password';
    const send_to = userDetails.email;
    const sent_from = process.env.HOST_EMAIL;

    try{
        await sendMail(subject,message,send_to,sent_from)
        res.status(200).json({
            success:true,
            message:"Reset mail sent successfully"
        })
    }
    catch(err)
    {
        res.status(400);
        throw new Error('Email not sent, Try again Later');
    }
})


module.exports = {registerUser,loginStatus,loginUser,logout,getUser,updateUser,foregetPassword,changePassword};