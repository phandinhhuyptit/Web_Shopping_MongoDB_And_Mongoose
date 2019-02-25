const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.Get_Login = (req, res, next) => {


    res.render('Auth/login', {

        Path: '/login',
        TitlePage: 'Login',
        isAuthenticated: false

    });
};

exports.Post_Login = (req, res, next) => {

    const Email = req.body.email;
    const Password = req.body.password;
    


    User.findById('5c70f5301e0806425c377368')
        .then(user => {

            console.log(user);
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            })
        })
    // .then(() =>{

    //     res.status(200).redirect('/');

    // })
};
exports.Post_Logout = (req, res, next) => {


    req.session.destroy(err => {

        console.log(err);
        res.redirect('/');

    });

}

exports.Get_Sign_Up = (req, res, next) => {


    res.render('Auth/signup', {

        Path: '/signup',
        TitlePage: 'Sing Up',
        isAuthenticated: false

    });
}
exports.Post_Sign_Up = (req, res, next) => {

    const Email = req.body.email.toLowerCase();
    const Name = req.body.name;
    const Password = req.body.password;
    const ConfirmPassword = req.body.confirmPassword;

    User.findOne({ Email: Email })
        .then(user => {
            if (!user) {
                if (Password !== ConfirmPassword) {

                    return res.redirect('/signup');

                }

                return bcrypt.hash(Password, 12)
                    .then(haddlePassword => {
                        if (haddlePassword) {

                            const Account = new User({
                                Name: Name,
                                Email: Email,
                                Password: haddlePassword,
                                Cart: {
                                    Items: []
                                }
                            })
                            return Account.save();
                        }
                        return res.redirect('/signup');

                    })
                    .then(result => {

                        res.redirect('/login');

                    })
                    .catch(err => {

                        console.log(err);

                    })



            }
            return res.redirect('/signup')

        })

        .catch(err => {

            console.log(err);


        })
}


