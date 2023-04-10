const express = require('express');
const shopRouter = express.Router();

const {
    httpGetHome,
    httpGetSignup,
    httpGetLogin,
    httpGetOTP,
    httpVerifyPhone,
    httpPostVerifyOTP,

    
    httpGet404,
} = require('../controllers/shop.controller');


shopRouter.get('/',httpGetHome);
shopRouter.get('/login',httpGetLogin);
shopRouter.get('/signup',httpGetSignup);
shopRouter.get('/otp-login',httpGetOTP);
shopRouter.post('/verify-login',httpVerifyPhone);
shopRouter.post('/otp-verify',httpPostVerifyOTP);


shopRouter.get('*',httpGet404);

module.exports = shopRouter;
