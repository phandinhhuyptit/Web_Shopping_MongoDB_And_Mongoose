const Product = require('../models/product');
const mongodb = require('mongodb');
const { validationResult } = require('express-validator/check');
const mongoose = require('mongoose');
const filterFile = require('../util/file');

const ObjectId = mongodb.ObjectId;
const Items_Per_Page = 9;


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

    const errors = validationResult(req);


    const title = req.body.title.replace(/\s{2,}/g, ' ');
    const image = req.file;
    const price = req.body.Price;
    const description = req.body.Description;

    if (!image) {


        return res.status(402).render('Admin/add-product',
            {
                TitlePage: 'Add Product',
                Path: '/admin/add-product',
                Editing: false,
                ErrorMessage: 'Attached file is not an image.',
                OldInput: {

                    title: title,
                    Price: price,
                    Description: description

                },
                ValidationError: [{ param: 'image' }]
            });

    }

    if (!errors.isEmpty()) {

        return res.status(402).render('Admin/add-product',
            {
                TitlePage: 'Add Product',
                Path: '/admin/add-product',
                Editing: false,
                ErrorMessage: errors.array()[0].msg,
                OldInput: {

                    title: title,
                    Price: price,
                    Description: description

                },
                ValidationError: errors.array()
            });
    }

    const imageURL = image.path;


    let pro_duct = new Product({
        Title: title,
        Price: price,
        Description: description,
        ImageURL: imageURL,
        UserID: req.user
    });
    return pro_duct.save()
        .then(result => {

            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);
        });
};

exports.GetAdminProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let TotalProduct;

    Product.find()
        .countDocuments()
        .then(CountProduct => {

            TotalProduct = CountProduct;
            return Product.find()
                .skip( ((page - 1 )*Items_Per_Page))
                .limit(Items_Per_Page)
        })

        .then(products => {

            if (!products) {

                throw new Error(' Not Get Products ');
            }
            res.render('Admin/products',
                {   
                    CurrentPage : page,
                    TotalProduct: TotalProduct,
                    HasPrevious : page > 1 ,
                    HasNext : (page * Items_Per_Page) <= TotalProduct,
                    NextPage :page + 1,
                    PreviousPage : page -1,
                    LastPage : Math.ceil(TotalProduct / Items_Per_Page ),                 
                    TitlePage: 'Admin Products',
                    Path: '/admin/products',
                    prods: products
                }
            );

        })
        .catch(err => {

            const error = new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);

        })
}

exports.PostEditProduct = (req, res, next) => {

    const ProductId = req.body.productId;
    const title = req.body.title;
    const image = req.file;
    const price = req.body.Price;
    const description = req.body.Description;

    const errors = validationResult(req);
    if (!image) {



        return res.status(402).render('Admin/add-product',
            {
                TitlePage: 'Add Product',
                Path: '/admin/add-product',
                Editing: false,
                ErrorMessage: 'Attached file is not an image.',
                product: {

                    Title: title,
                    Price: price,
                    Description: description,
                    _id: ProductId

                },
                ValidationError: [{ param: 'image' }]
            });
    }
    if (!errors.isEmpty()) {
        return res.render('Admin/add-product',
            {
                TitlePage: 'Edit Product',
                Path: '/admin/edit-product',
                Editing: true,
                ErrorMessage: errors.array()[0].msg,
                product: {

                    Title: title,
                    Price: price,
                    Description: description,
                    _id: ProductId
                },
                ValidationError: errors.array()
            });
    }
    const imageURL = image;

    Product.findByIdAndUpdate({ _id: new ObjectId(ProductId) },
        {
            Title: title,
            Price: price,
            Description: description,
            ImageURL: imageURL
        })

        .then(EditProduct => {
            if (!EditProduct) {

                throw new Error('Not Find Product. Plase Wait Technical');

            }

            res.redirect('/admin/products');

        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);
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

        Product.findById({ _id: new ObjectId(ID) })
            .then(Product => {

                if (!Product) {

                    throw new Error('Not Find Product ');

                }

                res.render('Admin/add-product',
                    {
                        TitlePage: 'Edit Product',
                        Path: '/admin/edit-product',
                        Editing: EditMode,
                        product: Product,
                        ValidationError: [],
                        ErrorMessage: null


                    });
            })
            .catch(err => {

                const error = new Error(err);
                error.httpStatusCode = 500;
                // it will throw to middleware app js and then it will display routes 500 
                return next(error);


            })
        //   res.redirect('/');
    }
}

// Delete Product 
exports.PostDeleteProduct = (req, res, next) => {

    const ID = req.body.productId;

    Product.findById(ID)
        .then(product => {

            if (!product) {

                return next(new Error('Not Product Found'));

            }

            filterFile.DeleteFile(product.ImageURL);
            return Product.deleteOne({ _id: ID })

        })
        .then(result => {

            return res.redirect('/admin/products');

        })
        .catch(err => {

            const error = new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);


        })
}; 