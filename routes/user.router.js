const express = require('express');
const userRouter = express.Router();

const {
    isLoggedIn,
    isLoggedOut,
} = require('../auth/user.auth');

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
} = require('../controllers/user.controller');


userRouter.get('/',httpGetHome);
userRouter.get('/login',isLoggedOut,httpGetLogin);
userRouter.post('/login');
userRouter.get('/signup',isLoggedOut,httpGetSignup);
userRouter.get('/otp-login',isLoggedOut,httpGetOTP);
userRouter.post('/verify-login',isLoggedOut,httpVerifyPhone);
userRouter.post('/otp-verify',isLoggedOut,httpPostVerifyOTP);
userRouter.post('/signup-otp',httpSignUpOtpVerify);
userRouter.post('/signup',httpPostSignUp);


userRouter.post('/logout',httpPostLogout);
userRouter.get('*',httpGet404);

module.exports = userRouter;
