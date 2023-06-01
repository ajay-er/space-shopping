const express = require('express');
const userRouter = express.Router();

const upload = require('../config/multer');

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
  httpUpdateUserdata,
  httpGetLogout,
  httpGet404,
} = require('../controllers/user.controller');

const {
  httpGetProduct,
  httpGetAllProducts,
  httpCategoryProduct,
} = require('../controllers/product.controller');

const {
  httpGetCart,
  httpPostToCart,
  httpRemoveFromCart,
  httpUpdateQuantity,
  httpClearCart,
} = require('../controllers/cart.controller');



const {
  httpGetCheckout,
  httpPostCheckout,
  httpAddAddress,
  httpVerifyPayment,
  httpSuccessPage,
  httpFailedPage,
  httpCancelOrder,
  httpReturnOrder,
  httpDeleteAddress,
  httpGetWallet,
  httpApplyWallet,
  httpGetOrderDetails,

} = require('../controllers/order.controller');


//user routes
userRouter.get('/', httpGetHome);
userRouter.get('/login', isLoggedOut, httpGetLogin);
userRouter.post('/login', httpPostLoginVerify);
userRouter.get('/otp-login', isLoggedOut, httpGetOtpLogin);
userRouter.post('/otp-login', httpLoginVerifyPhone);
userRouter.get('/otp-verify', isLoggedOut, httpGetOtpVerify);
userRouter.post('/otp-verify', isLoggedOut, httpPostVerifyOtp);

userRouter.get('/signup', isLoggedOut, httpGetSignup);
userRouter.post('/signup', isLoggedOut, httpPostSignup);
userRouter.post('/signup-otp', isLoggedOut, httpSignupOtpVerify);

userRouter.get('/product/:slug', httpGetProduct);
userRouter.get('/shop', httpGetAllProducts);
userRouter.get('/shop/:id', httpCategoryProduct);

userRouter.get('/cart', isLoggedIn, httpGetCart);
userRouter.post('/cart', isLoggedIn, httpPostToCart);
userRouter.delete('/cart',isLoggedIn,httpRemoveFromCart);
userRouter.patch('/cart',isLoggedIn,httpUpdateQuantity);
userRouter.delete('/clear-cart',isLoggedIn,httpClearCart);

userRouter.get('/checkout',isLoggedIn,httpGetCheckout);
userRouter.post('/checkout',isLoggedIn,httpPostCheckout);
userRouter.post('/add-address',isLoggedIn,httpAddAddress);
userRouter.delete('/delete-address',isLoggedIn,httpDeleteAddress);
userRouter.post('/update-userdata',upload.single('profileimage'),isLoggedIn,httpUpdateUserdata);

userRouter.post('/verify-payment',isLoggedIn,httpVerifyPayment);
userRouter.get('/order-successfull/:id',isLoggedIn,httpSuccessPage);
userRouter.get('/order-failed/:id',isLoggedIn,httpFailedPage);

userRouter.post('/order-cancel',isLoggedIn,httpCancelOrder);
userRouter.post('/order-return',isLoggedIn,httpReturnOrder);

userRouter.get('/wallet',isLoggedIn,httpGetWallet);
userRouter.put('/apply-wallet',isLoggedIn,httpApplyWallet);

userRouter.get('/account', httpGetAccount);
userRouter.get('/order-details',isLoggedIn, httpGetOrderDetails);

userRouter.get('/logout', httpGetLogout);
userRouter.get('*', httpGet404);

module.exports = userRouter;
