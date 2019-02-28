const express = require('express');
const router = express.Router();
const AdminController = require('../controller/Admin');
const isAuth = require('../Middleware/is-auth');
const { check, body } = require('express-validator/check');


// /Admin/add-product => GET
router.get('/add-product', isAuth.LockMenu, AdminController.GetAddProduct);


// Admin/add-product =>POST 

router.post('/add-product',
    [
        check('title')
            .isAlphanumeric()
            .trim(),
        check('imageURL')
            .isURL()
            .withMessage('Please Enter URL')
            .trim()
        ,
        check('Price')
            .isFloat()
            .withMessage('Please Enter Price')
            .trim()
        ,
        check('Description')
            .isLength({ min: 5, max: 400 })
            .withMessage('Please Enter Description')
            .trim()
    ]
    , isAuth.LockMenu, AdminController.PostAddProduct);

// // Admin/products =>GET

router.get('/products', isAuth.LockMenu, AdminController.GetAdminProducts);

router.get('/edit-product/:ID', isAuth.LockMenu, AdminController.GetEditProduct);

router.post('/edit-product',

    [
        check('title')
            .isLength({min: 4})
            .withMessage('Please Check Out Length Of Title And Enter Title')
            .trim(),
        check('imageURL')
            .isURL()
            .withMessage('Please Check And Enter URL')
            .trim()
        ,
        check('Price')
            .isFloat()
            .withMessage('Please Check Out And Enter Price')
            .trim()
        ,
        check('Description')
            .isLength({ min: 5, max: 400 })
            .withMessage('Please Enter Description')
            .trim()
    ]
    , isAuth.LockMenu, AdminController.PostEditProduct);

router.post('/delete-product', isAuth.LockMenu, AdminController.PostDeleteProduct);

module.exports = router;


