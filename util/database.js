const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;


let _db;

const mongoConnect = callback =>{

MongoClient.connect('mongodb+srv://PhanDinhHuy_1996:professionalhuy331@severwebshop-xbrlk.mongodb.net/test?retryWrites=true',{useNewUrlParser: true})
.then(client =>{       
    console.log('Connected!');
    _db = client.db(); 
    callback(_db);
})
.catch( err =>{
    console.log(err);
    throw err;

})
}

const GetDb = () =>{

    if(_db){
        return _db;
    }
    
}
exports.mongoConnect = mongoConnect;
exports.GetDb  = GetDb;




