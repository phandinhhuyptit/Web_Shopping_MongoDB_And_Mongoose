const mongoose = require('mongoose');


// Doly And Declare  Schema 
const Schema = mongoose.Schema;

// Create Schme Product Schema
const ProductSchema = new Schema ({

    Title :{

        type: String, 
        required: true        
    },
    Price : {

        type : Number ,
        required: true 
    },
    Description : {
        type : String ,
        required : true
    },
    ImageURL : {

        type : String , 
        required : true
    }

})

// Create Collection 
module.exports = mongoose.model('Product' , ProductSchema);    

// const Cart = require('./cart');
// const GetDb = require('../util/database').GetDb;
// const mongodb = require('mongodb');
// // module.exports = class Product {
// //     // constructor properties    
// //     constructor(id, title, imageURL, Price, Description,UserId) {
// //         this._id = id
// //         this.Title = title;
// //         this.ImageURL = imageURL;
// //         this.Price = Price;
// //         this.Description = Description;
// //         this.UserId = UserId;
// //     }

// //     //Create Table and Insert Data with Collection and InsertOne 
// //     save() {
// //         const db = GetDb();
// //         let dbProduct;

// //         if (this._id) {
// //             console.log('OK');
// //             // Update the product
// //              dbProduct = db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this })
           
// //         }

// //         else {
// //             // Add the Product 
// //             dbProduct =db
// //             .collection('products')
// //             .insertOne(this)
// //             .then(result => {
// //                 console.log(result);
// //             })
// //             .catch(err => {
// //                 console.log(err);
// //             });       

// //         }
// //      return dbProduct.then( product =>{
         
// //            console.log(product);
// //      })   
// //      .catch(err =>{

// //         console.log(err);
// //      })   

// //     }
                          

// //     static fetchAll() {
// //         const db = GetDb();
// //         return db
// //             // Connect To Products 
// //             .collection('products')
// //             // Find Value of Data like Filter 
// //             .find()
// //             // Get All Documents and Turn Them into Javascript Array 
// //             .toArray()
// //             .then(products => {
               
// //                 return products;

// //             })
// //             .catch(err => {

// //                 console.log(err);

// //             });


// //     }
// //     static FindById(productId) {
// //         const db = GetDb();
// //         return db
// //             .collection('products')
// //             // if you want Object Cast , you should use new mongodb.
// //             // ObjectID  it will covert from string to object on MogoDB         
// //             .find({ _id: new mongodb.ObjectID(productId) })
// //             .next()
// //             .then(product => {
                
// //                 return product;
// //             })
// //             .catch(err => {

// //                 console.log(err);
// //             })
// //     }

// //     static DeletePrductID(productId) {
// //         const db = GetDb();
// //         return db
// //             .collection('products')
// //             .deleteOne({ _id: new mongodb.ObjectId(productId) })
// //             .then(product => {
// //                 console.log(product);
// //             })
// //             .catch(err => {

// //                 console.log(err);

// //             })
// //     }
// //     // Get Data From products.json than we will pass into view
// // }