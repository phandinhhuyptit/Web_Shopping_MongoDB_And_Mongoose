

// Lock Redirect For User
exports.LockMenu = (req , res , next  ) =>{

    if(!req.session.isLoggedIn){
        
            res.redirect('/login');
    }
    next();
}
exports.LockLogGin = (req , res , next ) =>{

        if(req.session.isLoggedIn){

            res.redirect('/');

        }
     next();   

}

