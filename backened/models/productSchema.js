const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    name:{
        type:String,
        required:[true,"Please add product name"],
        trim:true,
        lowercase:true,
    },
    sku:{
        type:String,
        required:true,
        default:"SKU",
        trim:true,
    },
    category:{
        type:String,
        required:[true,"Please add a Category"],
        trim:true,
        lowercase:true,
    },
    quantity:{
        type:Number,
        required:[true,"Please Add quantity"],
        trim:true,
    },
    price:{
        type:Number,
        required:[true,"Please add price"],
        trim:true,
    },
    description:{
        type:String,
        required:[true,"Please add a description"],
        trim:true
    },
    image:{
        type:Object,
        default:{},
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Product',productSchema);