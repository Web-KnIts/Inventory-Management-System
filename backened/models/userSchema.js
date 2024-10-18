const mongoose = require('mongoose');
const userSchema = new  mongoose.Schema ({
    name:{
        type:String,
        trim:true,
        required:[true,'Please Add the Name'],
        lowercase:true,
    },
    email:{
        type:String,
        unique:true,
        required:[true,'Please add email'],
        trim:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid Email"
        ]
    },
    password:{
        type:String,
        required:[true,'Please add a Password'],
        minLength:[6,'Password should have atleast 6 char'],
    },
    profile_picture:{
        type:String,
        required:[true,'Please add a profile picture'],
        default:"https://i.ibb.co/4pDNDk1/avatar.png"
    },
    phone_number:{
        type:String,
        required:[true,'Please add Phone Number'],
        minLength:[10,'Phone number invalid'],
        maxLength:[10,'Phone number invalid']
    },
    bio:{
        type:String,
        default: "bio",
        maxLength:[150,'maximum 150 char are allowed']

    }
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)