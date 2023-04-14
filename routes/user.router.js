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
    httpGetOtpLogin,
    httpLoginVerifyPhone,
    httpGetOtpVerify,
    httpPostVerifyOtp,
    httpSignupOtpVerify,
    httpPostSignup,

    httpPostLogout,
    httpGet404,
} = require('../controllers/user.controller');


userRouter.get('/',httpGetHome);
userRouter.get('/login',isLoggedOut,httpGetLogin);
// * userRouter.post('/login');
userRouter.get('/otp-login',isLoggedOut,httpGetOtpLogin);
userRouter.post('/otp-login',isLoggedOut,httpLoginVerifyPhone);
userRouter.get('/otp-verify',isLoggedOut,httpGetOtpVerify);
userRouter.post('/otp-verify',isLoggedOut,httpPostVerifyOtp);

userRouter.get('/signup',isLoggedOut,httpGetSignup);
userRouter.post('/signup',httpPostSignup);
userRouter.post('/signup-otp',httpSignupOtpVerify);


userRouter.post('/logout',httpPostLogout);
userRouter.get('*',httpGet404);

module.exports = userRouter;
