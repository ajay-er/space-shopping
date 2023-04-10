const express = require('express');
const shopRouter = express.Router();

const shopController = require('../controllers/shop.controller');

shopRouter.get('/dd',(req,res)=>{
    res.render('shop/logins/login.ejs');
})

shopRouter.get('/contact',(req,res)=>{
    res.render('shop/contact');
})


module.exports = shopRouter;
