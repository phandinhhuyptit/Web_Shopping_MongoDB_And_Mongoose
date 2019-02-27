const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

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
        ErrorMessage: message

    });
};

exports.Post_Login = (req, res, next) => {

    const Email = req.body.email.toLowerCase();
    const Password = req.body.password;

    User.findOne({ Email: Email })
        .then(user => {

            if (!user) {


                req.flash('Error', ' Invalid Email Or Password ');
                res.status(300).redirect('/login');
            }

            return bcrypt.compare(Password, user.Password)
                .then(doMatch => {
                    if (!doMatch) {

                        req.flash('Error', ' Invalid Email Or Password ');
                        return res.redirect('/login');

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
            console.log(err);
        })
};
exports.Post_Logout = (req, res, next) => {


    req.session.destroy(err => {

        console.log(err);
        res.redirect('/');

    });

}

exports.Get_Sign_Up = (req, res, next) => {

    let message = req.flash('Error');
    if (message.length > 0) {

        message = message[0];

    } else {

        message = null
    }

    res.render('Auth/signup', {

        Path: '/signup',
        TitlePage: 'Sing Up',
        ErrorMessage: message

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
                    req.flash('Error', 'Incorect Password ');
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

                        return transporter.sendMail({
                            to: Email,
                            from: 'sihaojunvn2012@gmail.com',
                            subject: 'Signup succeeded!',
                            html: '<h1>You successfully signed up!</h1>'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            req.flash('Error', 'E-Mail Exist Already.Please Pick Different One');
            return res.redirect('/signup')

        })

        .catch(err => {

            console.log(err);


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

                console.log(err);

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

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (user) {
                res.render('Auth/new-password', {

                    TitlePage: 'New Password',
                    Path: `/reset/${token}`,
                    ErrorMessage: message,
                    userId : user._id.toString(),
                    TokenUser : token
                    
                })
            }
        })
        .catch( err =>{

            console.log(err);

        })
}
exports.Post_New_Password = (req, res, next) => {
    
      const New_Password = req.body.password;
      const UserId = req.body.userId;
      const PasswordToken = req.body.PasswordToken;
      const ConfirmPassword = req.body.ConfirmPassword;
      let resetUser;      

     User.findOne({ _id : UserId ,resetToken: PasswordToken, resetTokenExpiration: { $gt: Date.now() }})   
    .then(user =>{
       if( user ){
           if(New_Password === ConfirmPassword){

                resetUser =user;
                return bcrypt.hash(New_Password,12);
           }
           console.log("OK Error");
           req.flash('Error','Incorrect Password . Please Enter Again');
           return res.redirect(`/reset/${PasswordToken}`);
       }
       res.redirect('/reset')
    })
    .then(HandlePassword =>{

            resetUser.Password = HandlePassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration =undefined;
            return resetUser.save();
    })
    .then( result =>{

        res.redirect('/');

    })
    .catch( err =>{
        console.log(err);
    })
};