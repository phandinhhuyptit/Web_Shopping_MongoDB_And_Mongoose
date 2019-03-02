const Product = require('../models/product');
const User = require('../models/user');
const Orders = require('../models/order');
const fs = require('fs');
const stripe = require("stripe")("sk_test_xW7oGbnfYwyjSoHpRa8PAtwM");
const path = require('path');
const PDFDocument = require('pdfkit');
const Items_Per_Page = 9;
let TotalPayMent = 0;
exports.Get_Product_List = (req, res, next) => {

    const page = +req.query.page || 1  
    let TotalProduct;    


    Product.find()
    .countDocuments()
    .then( CountProduct =>{

        TotalProduct = CountProduct;
        
        return Product.find()
        .skip((page -1) * Items_Per_Page)
        .limit(Items_Per_Page)        
    })
    .then(products => {

            res.render('Shop/product-list',
                {
                    CurrentPage : page,
                    TotalProduct: TotalProduct,
                    HasPrevious : page > 1 ,
                    HasNext : (page * Items_Per_Page) <= TotalProduct,
                    NextPage :page + 1,
                    PreviousPage : page -1,
                    LastPage : Math.ceil(TotalProduct / Items_Per_Page ),
                    prods: products,
                    TitlePage: 'Products',
                    Path: '/Products'

                });
        })
        .catch(err => {

            const error = new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);

        })
}

exports.Get_Index = (req, res, next) => {

    const page = +req.query.page || 1;
    let TotalProduct;

    Product.find()
        .countDocuments()
        .then(CountProduct => {

             TotalProduct = CountProduct;
            return Product.find()
                .skip((page - 1) * Items_Per_Page)
                .limit(Items_Per_Page)               
               
        })
        .then(products => {

            res.render('Shop/index',
                {

                    CurrentPage : page,
                    TotalProduct: TotalProduct,
                    HasPrevious : page > 1 ,
                    HasNext : (page * Items_Per_Page) <= TotalProduct,
                    NextPage :page + 1,
                    PreviousPage : page -1,
                    LastPage : Math.ceil(TotalProduct / Items_Per_Page ),
                    prods: products,
                    TitlePage: 'Shop',
                    Path: '/'

                });


        })
        .catch(err => {

            const error = new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);

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

            const error = new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);

        })
};

exports.Post_Order = (req, res, next) => {
    // Token is Created using CheckOut Or Elements!
    // Get The Payment Token Id Submitted By The Form :
    
    req.user
        .populate('Cart.Items.ProductId')
        .execPopulate()
        .then(user => {
           
            const products = user.Cart.Items.map(Items => {


                return { Quantity: Items.Quantity, Product: { ...Items.ProductId._doc } }

            })
            user.Cart.Items.forEach( products =>{

                TotalPayMent = products.Quantity * products.ProductId.Price;

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
            stripe.charges.create({
                amount: TotalPayMent * 100,
                currency: "usd",
                source: req.body.stripeToken,                          
                description: 'Order Sucessful',
                     

            })
            return req.user.ClearCart();


        })
        .then(() => {

            res.redirect('/Orders');


        })
        .catch(err => {


            const error = new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);

        })
};

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

            const error = new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);
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

            return res.redirect('/Cart');
            1
        })
        .catch(err => {

            const error = new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);
        })
    res.redirect('/Cart');


};

exports.GetInvoice = (req, res, next) => {
    const OrderId = req.params.orderId;
    console.log(OrderId);
    Orders.findById(OrderId)
        .then(order => {

            if (!order) {


                return next(new Error('Not  order Found'));

            }
            if (order.User.UserId.toString() !== req.user._id.toString()) {

                return next(new Error('Unauthorized'));
            }
            const invoiceName = 'invoice-' + OrderId + '.pdf';

            // custom redirect.
            const invoicePath = path.join('Data', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument;
            res.setHeader('Content-Type', 'application/pdf');


            // create file pdf   
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('-------------------------');
            let totalPrice = 0;
            order.Products.forEach(prod => {
                totalPrice += prod.Quantity * prod.Product.Price;
                pdfDoc
                    .fontSize(14)
                    .text(
                        prod.Product.Title +
                        ' - ' +
                        prod.Quantity +
                        ' x ' +
                        '$' +
                        prod.Product.Price
                    );
            });
            pdfDoc.fontSize(20).text('--------------------------');
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
            pdfDoc.end();
        })
        .catch(err => {

            next(err);
        })
};
// Check Out Order
exports.Get_Check_Out = (req, res, next) => {
    
    req.user
        .populate('Cart.Items.ProductId')
        .execPopulate()
        .then(user => {
            const products = user.Cart.Items;
            let Total = 0;
            
            products.forEach( product =>{

                Total +=product.Quantity * product.ProductId.Price;

            })
            
          return  res.render('Shop/checkout', {

                TitlePage: 'Check Out',
                Path: '/CheckOut',
                Products: products,
                TotalSum : Total
            });

        })
        .then( err =>{

            return next(err);


        })
};




