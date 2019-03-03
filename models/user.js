const mongoose = require('mongoose');
const Product = require('./product');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true
    },
    
    Password : {
        type : String,
        required: true
    },
     
    Position : {
        type : String,
        required: true
    },
    resetToken : String,
    resetTokenExpiration : Date,   
    Cart: {

        Items: [
            {
                ProductId: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
                Quantity: { type: Number, required: true }
            }
        ]

    }
});

UserSchema.methods.Add_To_Cart = function (Product) {


    const CartProductIndex = this.Cart.Items.findIndex(Prduct_Of_Cart => Prduct_Of_Cart.ProductId.toString() === Product._id.toString());

    const UpdateCartItems = [...this.Cart.Items];
    let NewQuantity = 1;

    if (CartProductIndex >= 0) {

        NewQuantity = this.Cart.Items[CartProductIndex].Quantity + 1;
        UpdateCartItems[CartProductIndex].Quantity = NewQuantity;
    }
    else {

        UpdateCartItems.push({ ProductId: Product._id, Quantity: NewQuantity });

    }
    const UpdateCart = {

        Items: UpdateCartItems
    }
    this.Cart = UpdateCart
    return this.save();
}


UserSchema.methods.DeleteProductFromCart = function (Id) {
    const UpdateCart = this.Cart.Items.filter(product => {

        return product.ProductId.toString() !== Id.toString();

    });


    this.Cart.Items = UpdateCart;
    return this.save();

}

UserSchema.methods.Get_Cart = function (Product) {


    const ProductId = this.Cart.Items.map(p => {

        return p.ProductId

    });



    return Product.find({ _id: { $in: ProductId } })
        .then(Cartproducts => {

            return Cartproducts.map(p => {


                return {
                    _id: p._id,
                    Title: p.Title,
                    Price: p.Price,
                    Description: p.Description,
                    ImageURL: p.ImageURL,
                    Quantity: this.Cart.Items.find(Items => {

                        return p._id.toString() === Items.ProductId.toString();

                    }).Quantity
                };

            });

 
        })
        .catch(err => {
            console.log(err);

        })

}
UserSchema.methods.ClearCart = function() {

    this.Cart.Items = [];
    return this.save();
}

module.exports = mongoose.model('Users', UserSchema);


// const GetDb = require('../util/database').GetDb;
// const mongodb = require('mongodb');


// const ObjectId = mongodb.ObjectId;


// // module.exports = class User {

// //     constructor(id,username, mail,cart) {
// //         this._id = id;
// //         this.username = username;
// //         this.mail = mail;
// //         this.cart = cart;

// //     }

// //     save() {

// //         const db = GetDb();

// //         let dbUser = db.collection('Users')
// //             .insertOne(this)
// //             .then(User => {


// //                 return User;

// //             })
// //             .catch( err =>{

// //             })

// //          return dbUser ;  


// //     }

// //     Add_To_Cart(Product){

// //          const  Test  =   this.cart.Items.map( i => {
// //                 return i.ProductId;

// //          })         
// //         const db = GetDb();

// //         const CartProductIndex = this.cart.Items.findIndex( Prduct_Of_Cart => Prduct_Of_Cart.ProductId.toString() === Product._id.toString());

// //         const UpdateCartItems = [...this.cart.Items];
// //         let NewQuantity = 1;

// //         if(CartProductIndex >= 0){

// //             NewQuantity = this.cart.Items[CartProductIndex].Quantity +1;
// //             UpdateCartItems[CartProductIndex].Quantity = NewQuantity;
// //         }
// //         else{

// //             UpdateCartItems.push({ ProductId : new ObjectId(Product._id) , Quantity: NewQuantity } );

// //         }
// //             const UpdateCart = {

// //                 Items : UpdateCartItems
// //             }

// //         return db.collection('Users')
// //         .updateOne( { _id : new ObjectId(this._id)}, {$set : { cart :UpdateCart }} )  
// //        .then(user =>{

// //             return user;

// //        })
// //        .catch( err =>{
// //            console.log(err);
// //        })       

// //     }

// //     DeleteProductFromCart(productId){

// //         const db = GetDb();


// //         const UpdateCart = this.cart.Items.filter( product =>{

// //                     return product.ProductId.toString() !== productId.toString();

// //         })

// //        return  db.collection('Users')
// //         .updateOne({_id : new Object(this._id)} , {$set :{ cart :{Items : UpdateCart} } } )
// //         .then( CartItems =>{


// //             return CartItems;

// //         })
// //         .catch( err =>{

// //             console.log(err);

// //         })

// //     }



// //     GetCart() {

// //         const db = GetDb();

// //         const ProductId = this.cart.Items.map( p=>{          

// //             return p.ProductId

// //         });  


// //         return db.collection('products')
// //         .find({_id : {$in : ProductId }})
// //         .toArray()
// //         .then( Cartproducts =>{


// //             return  Cartproducts.map( p =>{                     


// //                   return  { ...p, Quantity : this.cart.Items.find(Items =>{

// //                            return  p._id.toString() === Items.ProductId.toString();

// //                    }).Quantity
// //                 };       

// //             });  


// //         })
// //         .catch(err =>{
// //             console.log(err);

// //         })
// //     }  

// //     GetOrder () {

// //         const db = GetDb();

// //         return db.collection('Orders')
// //         .find({ 'user._id' : new ObjectId(this._id)})
// //         .toArray()
// //         .then( Order => {

// //             console.log(Order);
// //             return Order;

// //         })
// //         .catch( err =>{

// //             console.log(err);

// //         })
// //     }

// //     AddOrder () {

// //         const db = GetDb();        
// //        return this.GetCart().
// //         then(product =>{

// //             const order = {

// //                 items : product,
// //                 user :{

// //                     _id : new ObjectId( this._id),                   
// //                     UserName : this.username,
// //                     Mail : this.mail
// //                 }
// //             }
// //            return   db.collection('Orders')
// //                      .insertOne(order)

// //         })
// //         .then (result =>{
// //             this.cart = { Items: [] };
// //             return db.collection('Users')
// //             .updateOne(  { _id : new ObjectId(this._id)}, {$set : { cart : {Items : [] }}})
// //             .then(User =>{
// //                 console.log(User);
// //             })

// //         })
// //         .catch(err =>{

// //             console.log(err);

// //         })
// //     }

// //     static findByID(UserId) {

// //         const db = GetDb();

// //         let dbUser = db.collection('Users')
// //                      .findOne({_id : new ObjectId(UserId)})
// //                      .then(User =>{
// //                          console.log(User);   
// //                         return User;
// //                      })
// //                      .catch( err =>{
// //                          console.log(err);
// //                      }) 

// //          return dbUser;            
// //     }

// // }
