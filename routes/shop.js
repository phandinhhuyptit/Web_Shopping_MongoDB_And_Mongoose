const express = require('express');
const router = express.Router();
const Product_Controller = require('../controller/product')
const isAuth = require('../Middleware/is-auth');



router.get('/Products',Product_Controller.Get_Product_List);
router.get('/Products/:ProductID',Product_Controller.Get_Product);

router.get('/Cart',isAuth.LockMenu,Product_Controller.Get_Cart);

router.get('/',Product_Controller.Get_Index);

router.post('/Cart',isAuth.LockMenu,Product_Controller.Post_Cart);


router.post('/create-order',isAuth.LockMenu,Product_Controller.Post_Order);

router.get('/Orders',isAuth.LockMenu,Product_Controller.Get_Order);

// router.get('/checkout', Product_Controller.getCheckout);

router.post('/cart-delete-item',isAuth.LockMenu,Product_Controller.Post_Delete_Cart_Item);

module.exports= router;