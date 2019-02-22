const Product = require('../models/product');
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;


exports.GetAddProduct = (req, res, next) => {


    res.render('Admin/add-product',
        {
            TitlePage: 'Add Product',
            Path: '/admin/add-product',
            Editing: false
        });
}
exports.PostAddProduct = (req, res, next) => {
    const Title = req.body.title;
    const ImageURL = req.body.imageURL;
    const Price = req.body.Price;
    const Description = req.body.Description;


    let pro_duct = new Product({ Title, Price, Description, ImageURL });
    pro_duct.save()
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
    const Title = req.body.title; 
    Product.findByIdAndUpdate({ _id: new ObjectId(ProductId) }, { Title, Price, Description, ImageURL })
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
                        product: Product
                    });
            })
        //   res.redirect('/');
    }
}

// Delete Product 
exports.PostDeleteProduct = (req, res, next) => {

    const ID = req.body.productId;
    Product.findByIdAndDelete(ID)
    .then(Product =>{

        res.redirect('/admin/products');
    })
    .catch( err =>{

        console.log(err);

    })
}; 