const path = require('path');
const fs = require('fs');



const p = path.join(path.dirname(process.mainModule.filename),
 'Data', 
 'cart.json'
 );



  module.exports = class cart {


    static AddProduct (id,priceProduct){

        
    fs.readFile(p, (err, fileContent) => {
        let cart = { Products: [], TotalPrice: 0 };
        if (err) {

            console.log(err);
          
        }
        
        else {
            cart = JSON.parse(fileContent);
            
          const  existingProductIndex = cart.Products.findIndex( p => p.id ===id);
          const existingProduct = cart.Products[existingProductIndex];
          let updataProduct;
          if(existingProduct){
            updataProduct = {...existingProduct};
            updataProduct.qty += 1;
            cart.Products = [...cart.Products]; 
            cart.Products[existingProductIndex] = {...updataProduct};
           
          }
          else {
           updataProduct ={  id:id, qty :1  }
           cart.Products = [...cart.Products,updataProduct];

          }
          cart.TotalPrice += priceProduct; 
          
          fs.writeFile(p,JSON.stringify(cart),err =>{

            console.log(err);

          }) 
        }
    });
    }

    static DeleteProduct(ID , Price){

       fs.readFile(p, (err, fileContent) => {
       if (err) {

          return ;

       }      
         const Cart = {...JSON.parse(fileContent)};

         const product = Cart.Products.find( p => p.id ===ID);
         if(!product){
           return ;
         }

         const ProdcutQty = product.qty;

          const UpdateProducts = Cart.Products.filter( p => p.id !==ID);

          Cart.TotalPrice -= Price * ProdcutQty;
          Cart.Products = [...UpdateProducts];         
          

          fs.writeFile(p, JSON.stringify(Cart), err => {
          console.log(err);
          });
       
       });


    }
    static GetCart (cb) {

      fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      }
      else {
        cb(JSON.parse(fileContent));
      }
      });

    } 

  }  
