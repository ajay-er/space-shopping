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
shopRouter.get('/otplogin',httpGetOTP);
shopRouter.post('/otplogin',httpVerifyPhone);
shopRouter.post('/otpverify',httpPostVerifyOTP);



shopRouter.get('/dd',(req,res)=>{
    res.render('shop/logins/otp-login');
})


shopRouter.get('*',httpGet404);

module.exports = shopRouter;
