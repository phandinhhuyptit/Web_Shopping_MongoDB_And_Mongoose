const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');
const AdminController = require('../controller/Admin');


// /Admin/add-product => GET
router.get('/add-product',AdminController.GetAddProduct);


// Admin/add-product =>POST 

router.post('/add-product',AdminController.PostAddProduct);

// // Admin/products =>GET

router.get('/products' , AdminController.GetAdminProducts);

router.get('/edit-product/:ID',AdminController.GetEditProduct);

router.post('/edit-product',AdminController.PostEditProduct);

router.post('/delete-product',AdminController.PostDeleteProduct);

module.exports = router;


