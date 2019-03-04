const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// Create Schema Like Table Of SQL 
const OrderSchema = new Schema({



    Products : [

        {
            Product : {  type :Object , require : true  },
            Quantity : { type : Number , require : true }
        }

    ],
    User : {
        Name : {
            type : String,
            require : true
        },

        Email : {
            type : String,
            require : true

        },
        UserId : {
            type : Schema.Types.ObjectId,
            ref : 'Users',
            reqiuire : true
        }
    }
})

module.exports =  mongoose.model( 'Oders',  OrderSchema  );









   




