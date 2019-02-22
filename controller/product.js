const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');

const mongodb = require('mongodb'); 

const ObjectId = mongodb.ObjectId;


exports.Get_Product_List = (req, res, next) => {

    Product.find()
    .then( products =>{
    
        res.render('Shop/product-list',
        {

            prods: products,
            TitlePage: 'Products',
            Path: '/Products',

        });        
    })
    .catch( err =>{

        console.log(err);

    })
       

          
        
    // res.sendFile(path.join(rootDir,'view','shop.ejs'));    
}

exports.Get_Index = (req, res, next) => {

    Product.find()
        .then(products => {
            res.render('Shop/index',
                {

                    prods: products,
                    TitlePage: 'Shop',
                    Path: '/'
                });
        })
        .catch(err => {

            console.log(err);

        })
}


// Dynamic Routes 
exports.Get_Product = (req, res, next) => {

    const ID = req.params.ProductID;

    Product.findById( {_id : new ObjectId(ID)} )
        .then(product => {

            res.render('Shop/product-detail', {

                Product: product,
                Path: `/Products/${product._id}`,
                TitlePage: 'Product Detail'
            })

        })
}


exports.Get_Order = (req, res, next) => {

    req.user.GetOrder()
        .then(orders => {


            res.render('Shop/orders', {

                Orders : orders,
                Path: '/Orders',
                TitlePage: 'Your Orders'
            });
        })
        .catch( err =>{

            console.log(err);
        })
};


exports.Post_Order = (req, res, next) => {

    req.user.AddOrder()
        .then(result => {

            res.redirect('/Orders');

        })

};
// chú ý chỗ này tối coi lại liên quan tới bất đồng bộ 
exports.Post_Cart = (req, res, next) => {


    const ID = req.body.productId;


    Product.FindById(ID)
        .then(product => {

            return req.user.Add_To_Cart(product);

        })
        .then( result =>{

            res.redirect('/Cart')

        } )
        .catch( err =>{

            console.log(err);
        })
   
}

exports.Get_Cart = (req, res, next) => {

    req.user.GetCart()
        .then(product => {

            res.render('Shop/cart', {

                TitlePage: 'Cart',
                Path: '/Cart',
                Products: product
            });
        })
}

exports.Post_Delete_Cart_Item = (req, res, next) => {

    const ID = req.body.productId;

    req.user.DeleteProductFromCart(ID)
    .then( result =>{

        
        res.redirect('/Cart')

    })

};


exports.getCheckout = (req, res, next) => {
    res.render('Shop/checkout', {
        Path: '/checkout',
        pageTitle: 'Checkout'
    });
};


