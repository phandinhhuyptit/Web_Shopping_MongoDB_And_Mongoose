const fs = require('fs');


// Xóa File    

const  DeleteFile =(FilePath) =>{

     fs.unlink(FilePath, err =>{

        if(err){

            throw (err);

        }


     })
} 

exports.DeleteFile = DeleteFile 


