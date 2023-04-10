const express = require('express');
const shopRouter = express.Router();

const {
    httpGetHome,
    


    httpGet404,
} = require('../controllers/shop.controller');

shopRouter.get('/',httpGetHome);

shopRouter.get('/dd',(req,res)=>{
    res.render('shop/logins/otp-login');
})


shopRouter.get('*',httpGet404);

module.exports = shopRouter;
