const User = require('../models/user');

exports.Get_Login = (req, res, next) => {
 
    
    res.render('Auth/login', {

        Path: '/login',
        TitlePage: 'Login',
        isAuthenticated: false

    });
};

exports.Post_Login = (req, res, next) => {
      
    User.findById('5c70f5301e0806425c377368')
    .then(user =>{

        console.log(user);    
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save( err =>{
            console.log(err);
            res.redirect('/');

        })

    })
    // .then(() =>{

    //     res.status(200).redirect('/');

    // })
};
exports.Post_Logout = (req, res , next ) => {


    req.session.destroy( err =>{
       
        console.log(err);
        res.redirect('/');

    });

}

