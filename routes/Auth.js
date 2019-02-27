const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const AuthController = require('../controller/Auth');
const isAuth = require('../Middleware/is-auth');
// ...rest of the initial code omitted for simplicity.
const { check, body } = require('express-validator/check');


router.get('/login', isAuth.LockLogGin, AuthController.Get_Login);

router.post('/login',
       check('email')
        .isEmail()
        .withMessage('Please enter a valid email')

    , isAuth.LockLogGin, AuthController.Post_Login);

router.post('/logout', AuthController.Post_Logout);

router.get('/signup', isAuth.LockLogGin, AuthController.Get_Sign_Up);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {

                return User.findOne({ Email: value })
                    .then(user => {

                        if (user) {

                            return Promise.reject('E-Mail Exist Already.Please Pick Different One');
                        }
                    })

            })
        ,
        body('password')
            .isLength({ min: 5 })
            .withMessage('Please enter a password least 5 characters.')
            .isAlphanumeric()
            .withMessage('Please enter password with only letter and number'),

        check('name')
            .isLength({ min: 2 }).withMessage('Please enter a name least 2 characters'),
        body('confirmPassword')
            .custom((value, { req }) => {

                if (value !== req.body.password) {

                    throw new Error('The Password Not Match ');

                }
            })

    ]
    ,
    isAuth.LockLogGin, AuthController.Post_Sign_Up);

router.get('/reset', isAuth.LockLogGin, AuthController.Get_Reset_Password);
router.post('/reset', isAuth.LockLogGin, AuthController.Post_Reset_Password);

router.get('/reset/:token', isAuth.LockLogGin, AuthController.Get_New_Password);

router.post('/new-password', isAuth.LockLogGin, AuthController.Post_New_Password);
module.exports = router;




