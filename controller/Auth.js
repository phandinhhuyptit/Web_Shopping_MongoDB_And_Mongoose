const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// ...rest of the initial code omitted for simplicity.
const {validationResult} = require('express-validator/check');

const transporter = nodemailer.createTransport(

    sendgridTransport({
        auth: {
            api_key: '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'
        }
    })
);

exports.Get_Login = (req, res, next) => {

    let message = req.flash('Error');
    if (message.length > 0) {

        message = message[0];

    } else {

        message = null
    }

    res.render('Auth/login', {

        Path: '/login',
        TitlePage: 'Login',
        ErrorMessage: message,
        OldInput: {
            Email: '',
            Password: ''
        },
        ValidationError: []
    });
};

exports.Post_Login = (req, res, next) => {

    const Email = req.body.email.toLowerCase();
    const Password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log(errors.array()[0].msg);
        return res.status(404).render('Auth/login', {

            Path: '/login',
            TitlePage: 'Login',
            ErrorMessage: errors.array()[0].msg,
            OldInput: {
                Email: Email,
                Password: Password
            },
            ValidationError: errors.array()
        });
    }
    User.findOne({ Email: Email })
        .then(user => {

            if (!user) {
              return  res.status(404).render('Auth/login', {

                    Path: '/login',
                    TitlePage: 'Login',
                    ErrorMessage: 'Invalid Email Or Password',                    
                    OldInput: {
                        Email: Email,
                        Password: Password
                    },
                    ValidationError: [{param : 'email'}]
                });
            }

            return bcrypt.compare(Password, user.Password)
                .then(doMatch => {
                    if (!doMatch) {

                       return res.status(404).render('Auth/login', {

                            Path: '/login',
                            TitlePage: 'Login',
                            ErrorMessage: 'Invalid Email Or Password',                            
                            OldInput: {
                                Email: Email,
                                Password: Password
                            },
                            ValidationError: [{param : 'password'} ]
                        });
                    }
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.save(err => {
                        console.log(err);
                        return res.status(200).redirect('/');

                    })
                })
                .catch(err => {

                    console.log(err);
                    res.status(404).json({ message: 'Auth failed ' });
                })
        })
        .catch(err => {
            const  error= new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);
         
        })
};
exports.Post_Logout = (req, res, next) => {


    req.session.destroy(err => {
        
        res.status(200).redirect('/');

    });
    
}

exports.Get_Sign_Up = (req, res, next) => {

    let message = req.flash('Error');
    if (message.length > 0) {

        message = message[0];

    } else {

        message = null
    }

    res.status(202).render('Auth/signup', {

        Path: '/signup',
        TitlePage: 'Sing Up',
        ErrorMessage: message,     
        OldInput: {
            Email: '',
            Name: '',
            Password: '',
            ConfirmPassword: ''
        },
        ValidationError: []

    });
}
exports.Post_Sign_Up = (req, res, next) => {
    
    const Email = req.body.email.toLowerCase();
    const Name = req.body.name.replace(/\s{2,}/g,' ');
    const Password = req.body.password;
    const ConfirmPassword = req.body.confirmPassword;
    const Position = "customer";
                
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        console.log(errors.array());

        return res.status(402).render('Auth/signup', {

            Path: '/signup',
            TitlePage: 'Sing Up',
            ErrorMessage: errors.array()[0].msg,            
            OldInput: {
                Email: Email,
                Name: Name,
                Password: Password,
                ConfirmPassword: ConfirmPassword
            },
            ValidationError: errors.array()
        });

    }
    return bcrypt.hash(Password, 12)
        .then(haddlePassword => {
            if (haddlePassword) {

                const Account = new User({
                    Name: Name,
                    Email: Email,
                    Password: haddlePassword,
                    Position : Position.toLowerCase(),
                    Cart: {
                        Items: []
                    }
                })
                return Account.save();
            }   
            return res.status(404).redirect('/signup');

        })
        .then(result => {

            res.redirect('/login');

            // return transporter.sendMail({
            //     to: Email,
            //     from: 'sihaojunvn2012@gmail.com',
            //     subject: 'Signup succeeded!',
            //     html: '<h1>You successfully signed up!</h1>'
            // });
        })
        .catch(err => {
            const  error= new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);
        })

      
}
exports.Get_Reset_Password = (req, res, next) => {


    
    let message = req.flash('Error');
    if (message.length > 0) {

        message = message[0];

    } else {

        message = null
    }
    res.render('Auth/reset', {

        Path: '/reset',
        TitlePage: 'Reset Password',
        ErrorMessage: message
       

    });
}

exports.Post_Reset_Password = (req, res, next) => {
    // Create Random Token   
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        // Change Buffer Convert  To String
        const token = buffer.toString('hex');
        User.findOne({ Email: req.body.email })
            .then(user => {
                // Check User If it not exist . we will throw Error 
                if (!user) {

                    req.flash('Error', 'No Account With That Email Found');
                    return res.redirect('/reset');
                }
                // Take Token Pass To User
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(resultUser => {

                return res.redirect(`http://localhost:3000/reset/${token}`);
            })
            .catch(err => {

                const  error= new Error(err);
                error.httpStatusCode = 500;
                // it will throw to middleware app js and then it will display routes 500 
                return next(error);

            })

    })
};
exports.Get_New_Password = (req, res, next) => {
    let message = req.flash('Error');
    if (message.length > 0) {

        message = message[0];

    } else {

        message = null
    }
    const token = req.params.token;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }})
        .then(user => {
            if (user) {
                res.render('Auth/new-password', {

                    TitlePage: 'New Password',
                    Path: `/reset/${token}`,
                    ErrorMessage: message,
                    userId: user._id.toString(),
                    TokenUser: token

                })
            }
        })
        .catch(err => {

            const  error= new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);

        })
}
exports.Post_New_Password = (req, res, next) => {

    const New_Password = req.body.password;
    const UserId = req.body.userId;
    const PasswordToken = req.body.PasswordToken;
    const ConfirmPassword = req.body.ConfirmPassword;
    let resetUser;

    User.findOne({ _id: UserId, resetToken: PasswordToken, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (user) {
                if (New_Password === ConfirmPassword) {

                    resetUser = user;
                    return bcrypt.hash(New_Password, 12);
                }
                console.log("OK Error");
                req.flash('Error', 'Passwords have to match! . Please Enter Again');
                return res.redirect(`/reset/${PasswordToken}`);
            }
            res.redirect('/reset')
        })
        .then(HandlePassword => {

            resetUser.Password = HandlePassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {

            res.redirect('/');
            console.log(result);

        })
        .catch(err => {
            const  error= new Error(err);
            error.httpStatusCode = 500;
            // it will throw to middleware app js and then it will display routes 500 
            return next(error);
        })
};