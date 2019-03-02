const fs = require('fs');

const  DeleteFile =(FilePath) =>{

     fs.unlink(FilePath, err =>{

        if(err){

            throw (err);

        }


     })
} 

exports.DeleteFile = DeleteFile 


