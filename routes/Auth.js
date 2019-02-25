const express = require('express');
const router = express.Router();
const AuthController = require('../controller/Auth');


router.get('/login' ,AuthController.Get_Login);

router.post('/login',AuthController.Post_Login);

router.post('/logout',AuthController.Post_Logout);


module.exports = router;




