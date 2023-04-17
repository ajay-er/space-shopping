const express = require('express');
const userRouter = express.Router();

const {
    isLoggedIn,
    isLoggedOut,
} = require('../middlewares/auth.handler');

const {
    httpGetHome,
    httpGetSignup,
    httpGetLogin,
    httpPostLoginVerify,
    httpGetOtpLogin,
    httpLoginVerifyPhone,
    httpGetOtpVerify,
    httpPostVerifyOtp,
    httpSignupOtpVerify,
    httpPostSignup,

    httpGetAccount,
    httpGetLogout,
    httpGet404,
} = require('../controllers/user.controller');


userRouter.get('/',httpGetHome);
userRouter.get('/login',isLoggedOut,httpGetLogin);
userRouter.post('/login',httpPostLoginVerify);
userRouter.get('/otp-login',isLoggedOut,httpGetOtpLogin);
userRouter.post('/otp-login',httpLoginVerifyPhone);
userRouter.get('/otp-verify',isLoggedOut,httpGetOtpVerify);
userRouter.post('/otp-verify',isLoggedOut,httpPostVerifyOtp);

userRouter.get('/signup',isLoggedOut,httpGetSignup);
userRouter.post('/signup',httpPostSignup);
userRouter.post('/signup-otp',httpSignupOtpVerify);

userRouter.get('/account',httpGetAccount);
userRouter.get('/logout',httpGetLogout);
userRouter.get('*',httpGet404);

module.exports = userRouter;
