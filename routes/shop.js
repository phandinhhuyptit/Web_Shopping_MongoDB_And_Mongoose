const express = require('express');
const router = express.Router();
const Product_Controller = require('../controller/product')

router.get('/Products',Product_Controller.Get_Product_List);
router.get('/Products/:ProductID',Product_Controller.Get_Product);

router.get('/Cart',Product_Controller.Get_Cart);

router.get('/',Product_Controller.Get_Index);

router.post('/Cart',Product_Controller.Post_Cart);


router.post('/create-order',Product_Controller.Post_Order);

router.get('/Orders', Product_Controller.Get_Order);

// router.get('/checkout', Product_Controller.getCheckout);

router.post('/cart-delete-item',Product_Controller.Post_Delete_Cart_Item);

module.exports= router;