const express = require('express');
const shopRouter = express.Router();

const {
    isLoggedIn,
    isLoggedOut,
} = require('../auth/shop.auth');

const {
    httpGetHome,
    httpGetSignup,
    httpGetLogin,
    httpGetOTP,
    httpVerifyPhone,
    httpPostVerifyOTP,
    httpSignUpOtpVerify,
    httpPostSignUp,

    httpPostLogout,
    httpGet404,
} = require('../controllers/shop.controller');


shopRouter.get('/',httpGetHome);
shopRouter.get('/login',isLoggedOut,httpGetLogin);
shopRouter.post('/login');
shopRouter.get('/signup',isLoggedOut,httpGetSignup);
shopRouter.get('/otp-login',isLoggedOut,httpGetOTP);
shopRouter.post('/verify-login',isLoggedOut,httpVerifyPhone);
shopRouter.post('/otp-verify',isLoggedOut,httpPostVerifyOTP);
shopRouter.post('/signup-otp',httpSignUpOtpVerify);
shopRouter.post('/signup',httpPostSignUp);


shopRouter.post('/logout',httpPostLogout);
shopRouter.get('*',httpGet404);

module.exports = shopRouter;
