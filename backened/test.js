const Cloudinary = require('./Database/cloudinary')

const image = "https://plus.unsplash.com/premium_photo-1731138967966-82b9a6abe306?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

// await Cloudinary.uploader.upload(image,{
//     // public_id:'unsplash_image',
//     colors:true,
//     quality_analysis:true,
//     folder:"Test",
//     resource_type:"image"
// }).then(res => console.log(res))


 Cloudinary.uploader.destroy("Test/b0b4t7k8bn3achgzcgod").then((res)=>console.log(res)).catch((err)=>console.log(err))