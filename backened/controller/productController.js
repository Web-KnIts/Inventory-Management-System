const asyncHandler = require('express-async-handler');
const Product = require('../models/productSchema');
const Cloudinary = require('../Database/cloudinary');
const fileSizeFormatter = require('../utils/fileUpload');


// Add product : ( need to test )
// step 1: validate details
// step 2: gather file data
// step 3: upload file on cloudinary
// step 4: create product instance
// step 5: send response
const addProduct = asyncHandler(async(req,res)=>{
    const {name,sku,category,quantity,price,description} = req.body;

    if(!name ||  !category || !quantity || !price || !description ) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }
    let fileData = {};
    if(req.file)
        {
        let image = req.file.path
        let uploadedFile;
        try{
            uploadedFile = await Cloudinary.uploader.upload(image,{
                folder:"Inventroy-Management-System",
                resource_type:"image",
            })
        }
        catch(err)
        {
            res.status(400)
            throw new Error('Image could not be uploaded')
        }

        fileData={
            fileName:req.file.originalname,
            filePath:uploadedFile.secure_url,
            public_id:uploadedFile.public_id,
            fileType:req.file.mimetype,
            fileSize:fileSizeFormatter(req.file.size,2)
        }
    }

    const newProduct = await Product.create({
        user: req.user._id,
        name,
        sku,
        category,
        price,
        quantity,
        description,
        image:fileData
    });
    return res.status(201).json({
        success:true,
        message:"Product Added into Database",
        productDetails:newProduct
    })
})


// All Products : ( need to test )
// step 1: fetch all data related to products matching to user Id
// step 2: send response
const getAllProducts = asyncHandler(async(req,res)=>{
    const allProductsDetails = await Product.find({user:req.user._id}).sort('-createdAt')
    res.status(200).json({
        success:true,
        message:"all proucts fetched successfully ",
        allProductsDetails,
    })
})

// Single Product : ( need to test )
// step 1: fetched product id from params
// step 2: search for product from database
// step 3: return details
const getSingleProduct = asyncHandler(async(req,res)=>{
    const getSingleProduct = await Product.findById(req.user._id);
    if(!getSingleProduct)
    {
        res.status(404);
        throw new Error('Product Not Found');
    }
    if(getSingleProduct.user.toString() !== req.user._id )
    {
        res.status(401)
        throw new Error('User not authorized')
    }
    res.status(200).json({
        success:true,
        message:"required product fetched successfully",
        product:getSingleProduct
    })
})

// delete Product : ( need to test )
// step 1: fetch product to be deleted
// step 2: find product from database
// step 3: fetch cloudinary image and delete it 
const deleteProduct = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    if(!id)
    {
        res.status(404);
        throw new Error('Internal Error ')
    }
    const productDetails = await Product.findById(id);
    if(!productDetails)
    {
        res.status(404);
        throw new Error('Product Not Found')
    }
    if(productDetails.user.toString() !== req.user._id)
    {
       res.status(401);
       throw new Error('User not authorized');
    }
    const deleteCloudinaryFile = productDetails.image.public_id;
    await Cloudinary.uploader.destroy(deleteCloudinaryFile).then((result)=>{
        console.log('File deleted from clodinary : ',result )
    }).catch((err)=>{
        console.log('Faild to delete File : ',err)
    })
    try{
        await productDetails.remove()
        res.status(200).json({
            success:true,
            message:"selected product deleted"
        })
    }
    catch(err){
        console.log(err);
        res.status(400)
        throw new Error('Faild to delete Product')
    }
})

// update product : ( need to test )
// step 1: get product details
// step 2: authenticate product
// step 3: update data
// step 4: return response; 

const updateProduct = asyncHandler(async(req,res)=>{
    const {name,category,quantity,price,description} = req.body;
    const {id} = req.params;

    const productDetails = await Product.findById(id);

    if(!productDetails)
    {
        res.status(400);
        throw new Error('product not found');
    }
    if(productDetails.user.toString() !== req.user._id)
    {
        res.status(401);
        throw new Error('User not authorized');
    }
    let fileData={};
    if(req.file)
    {
        let uploadedFile ;
        try{
            uploadedFile = await Cloudinary.uploader.uplaod(req.file.path,{
                folder:"Inventroy-Management-System",
                resource_type:"image",
            });
        }
        catch(err)
        {
            res.status(400);
            throw new Error('Image could not be uploaded')
        }
        fileData={
            fileName:req.file.originalName,
            filePath:uploadedFile.secure_url,
            fileType:req.file.mimetype,
            fileSize:fileSizeFormatter(req.file.size,2)
        }
    }

    const updateProductDetails = await Product.findByIdAndUpdate({_id:id},{
        name,category,quantity,description,price,image:Object.keys(fileData).length === 0 ? product?.image : fileData
    },{
        new:true,
        runValidators:true,
    })
    return res.status(200).json({
        success:true,
        message:"Product details updated",
        updateProductDetails
    })
})


module.exports = {
    addProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
}