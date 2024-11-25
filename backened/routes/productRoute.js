const express =require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {addProduct,deleteProduct,getAllProducts,getSingleProduct,updateProduct} = require('../controller/productController');
const { fileUpload } = require('../utils/fileUpload');

router.post('/add-product',authenticate,fileUpload,addProduct);
router.get('/all-product',authenticate,getAllProducts);
router.get('/:id',authenticate,getSingleProduct);
router.patch('/update-product/:id',authenticate,fileUpload,updateProduct);
router.delete('/delete-prouct/:id',authenticate,deleteProduct);

module.exports = router;