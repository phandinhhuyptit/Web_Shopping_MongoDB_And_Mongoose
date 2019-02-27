const express = require('express');
const router = express.Router();
const AuthController = require('../controller/Auth');
const isAuth = require('../Middleware/is-auth');



router.get('/login',isAuth.LockLogGin,AuthController.Get_Login);

router.post('/login',isAuth.LockLogGin,AuthController.Post_Login);

router.post('/logout',AuthController.Post_Logout);

router.get('/signup',isAuth.LockLogGin, AuthController.Get_Sign_Up);

router.post('/signup',isAuth.LockLogGin,AuthController.Post_Sign_Up);

router.get('/reset',isAuth.LockLogGin,AuthController.Get_Reset_Password);
router.post('/reset',isAuth.LockLogGin,AuthController.Post_Reset_Password);

router.get('/reset/:token',isAuth.LockLogGin,AuthController.Get_New_Password);

router.post('/new-password',isAuth.LockLogGin,AuthController.Post_New_Password);
module.exports = router;




