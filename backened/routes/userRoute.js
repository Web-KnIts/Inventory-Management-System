const express = require('express');
const {registerUser,loginUser,loginStatus,logout,getUser,updateUser,changePassword,forgetPassword,resetPassword} = require('../controller/registerUserController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();


router.post('/register-user',registerUser);
router.post('/login-user',loginUser);
router.get('/login-status',loginStatus);
router.get('/logout-user',logout);
router.get('/user-details',authenticate,getUser);
router.patch('/update-user',authenticate,updateUser);
router.patch('/change-password-user',authenticate,changePassword);
router.post('/forget-password-user',authenticate,forgetPassword)
router.put('/reset-password-user/:resetToken',resetPassword)

module.exports = router;