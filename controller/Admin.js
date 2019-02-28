const Product = require('../models/product');
const mongodb = require('mongodb');
const { validationResult } = require('express-validator/check')

const ObjectId = mongodb.ObjectId;


exports.GetAddProduct = (req, res, next) => {


    res.render('Admin/add-product',
        {
            TitlePage: 'Add Product',
            Path: '/admin/add-product',
            Editing: false,
            ErrorMessage: null,
            OldInput: {

                title: '',
                imageURL: '',
                Price: '',
                Description: ''
            },
            ValidationError: []
        });
}
exports.PostAddProduct = (req, res, next) => {

    const Error = validationResult(req);


    const title = req.body.title.replace(/\s{2,}/g, ' ');
    const imageURL = req.body.imageURL;
    const price = req.body.Price;
    const description = req.body.Description;
    if (!Error.isEmpty()) {
        console.log(Error);
        return res.status(402).render('Admin/add-product',
            {
                TitlePage: 'Add Product',
                Path: '/admin/add-product',
                Editing: false,
                ErrorMessage: Error.array()[0].msg,
                OldInput: {

                    title: title,
                    imageURL: imageURL,
                    Price1: price,
                    Description: description

                },
                ValidationError: Error.array()
            });
    }

    let pro_duct = new Product({

        Title: title,
        Price: price,
        Description: description,
        ImageURL: imageURL,
        UserID: req.user
    });
    return pro_duct.save()
        .then(result => {
            console.log('Created Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.GetAdminProducts = (req, res, next) => {

    Product.find()
        .then(products => {

            res.render('Admin/products',
                {
                    TitlePage: 'Admin Products',
                    Path: '/admin/products',
                    prods: products
                }
            );

        })
        .catch(err => {

            console.log(err)

        })
}

exports.PostEditProduct = (req, res, next) => {

    const ProductId = req.body.productId;
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.Price;
    const description = req.body.Description;

    const Error = validationResult(req);
    if (!Error.isEmpty()) {
       return res.render('Admin/add-product',
            {
                TitlePage: 'Edit Product',
                Path: '/admin/edit-product',
                Editing: true,
                ErrorMessage: Error.array()[0].msg,
                product: {

                    Title: title,
                    ImageURL: imageURL,
                    Price: price,
                    Description: description                    
                },
                ValidationError: Error.array()

            });
    }

    Product.findByIdAndUpdate({ _id: new ObjectId(ProductId) },
        {
            Title: title,
            Price: price,
            Description: description,
            ImageURL: imageURL
        })


        .then(EditProduct => {

            res.redirect('/admin/products');

        })
        .catch(err => {
            console.log(err);
        })
}

// Get Edit Product
exports.GetEditProduct = (req, res, next) => {

    const EditMode = req.query.Edit;
    // const ID = req.body.productId;       
    const ID = req.params.ID

    if (!EditMode) {

        res.redirect('/');

    }
    else {
        console.log(ID);

        Product.findById({ _id: new ObjectId(ID) })
            .then(Product => {

                res.render('Admin/add-product',
                    {
                        TitlePage: 'Edit Product',
                        Path: '/admin/edit-product',
                        Editing: EditMode,
                        product: Product,
                        ValidationError: [],
                        ErrorMessage : null


                    });
            })
        //   res.redirect('/');
    }
}

// Delete Product 
exports.PostDeleteProduct = (req, res, next) => {

    const ID = req.body.productId;
    Product.findByIdAndDelete(ID)
        .then(Product => {

            res.redirect('/admin/products');
        })
        .catch(err => {

            console.log(err);

        })
}; 