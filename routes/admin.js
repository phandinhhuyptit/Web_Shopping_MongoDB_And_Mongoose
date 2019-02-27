const express = require('express');
const router = express.Router();
const AdminController = require('../controller/Admin');
const isAuth = require('../Middleware/is-auth');


// /Admin/add-product => GET
router.get('/add-product',isAuth.LockMenu,AdminController.GetAddProduct);


// Admin/add-product =>POST 

router.post('/add-product',isAuth.LockMenu,AdminController.PostAddProduct);

// // Admin/products =>GET

router.get('/products' ,isAuth.LockMenu,AdminController.GetAdminProducts);

router.get('/edit-product/:ID',isAuth.LockMenu,AdminController.GetEditProduct);

router.post('/edit-product',isAuth.LockMenu,AdminController.PostEditProduct);

router.post('/delete-product',isAuth.LockMenu,AdminController.PostDeleteProduct);

module.exports = router;


