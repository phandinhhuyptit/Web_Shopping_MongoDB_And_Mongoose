const Product = require('../models/product');
const User = require('../models/user');
const Orders = require('../models/order');



exports.Get_Product_List = (req, res, next) => {



    Product.find()
        .then(products => {

            res.render('Shop/product-list',
                {

                    prods: products,
                    TitlePage: 'Products',
                    Path: '/Products'

                });
        })
        .catch(err => {

            console.log(err);

        })
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

    Product.findById({ _id: ID })
        .then(product => {

            res.render('Shop/product-detail', {

                Product: product,
                Path: `/Products/${product._id}`,
                TitlePage: 'Product Detail',
                
            })

        })
}

exports.Get_Order = (req, res, next) => {

    Orders.find({ 'User.UserId': req.user._id })
        .then(orders => {

            res.render('Shop/orders', {

                Orders: orders,
                Path: '/Orders',
                TitlePage: 'Your Orders'

            });
        })
        .catch(err => {

            console.log(err);

        })
};

exports.Post_Order = (req, res, next) => {

    req.user
        .populate('Cart.Items.ProductId')
        .execPopulate()
        .then(user => {

            const products = user.Cart.Items.map(Items => {


                return { Quantity: Items.Quantity, Product: { ...Items.ProductId._doc } }

            })

            const Order = new Orders({

                Products: products,
                User: {

                    Name: req.user.Name,
                    Email: req.user.Email,
                    UserId: req.user._id

                }
            })

            return Order.save();


        })
        .then(result => {

            return req.user.ClearCart();


        })
        .then(() => {

            res.redirect('/Orders');


        })
        .catch(err => {


            console.log(err);

        })
};
// chú ý chỗ này tối coi lại liên quan tới bất đồng bộ 



exports.Post_Cart = (req, res, next) => {


    const ID = req.body.productId;


    Product.findById(ID)
        .then(product => {

            return req.user.Add_To_Cart(product);

        })
        .then(result => {

            res.redirect('/Cart')

        })
        .catch(err => {

            console.log(err);
        })

}

exports.Get_Cart = (req, res, next) => {   

    req.user
        .populate('Cart.Items.ProductId')
        .execPopulate()
        .then(user => {
            const products = user.Cart.Items;          
            res.render('Shop/cart', {

                TitlePage: 'Cart',
                Path: '/Cart',
                Products: products
            });

        })
}

exports.Post_Delete_Cart_Item = (req, res, next) => {


    const ID = req.body.productId;


    req.user.DeleteProductFromCart(ID)
        .then(result => {

            res.redirect('/Cart');
1
        })
        .catch(err => {

            console.log(err);

        })
    res.redirect('/Cart');


};

exports.getCheckout = (req, res, next) => {
    res.render('Shop/checkout', {
        Path: '/checkout',
        pageTitle: 'Checkout'
    });
};


