const express = require('express');
const shopRouter = express.Router();

const shopController = require('../controllers/shop.controller');

shopRouter.get('/dd',(req,res)=>{
    res.render('shop/home.ejs');
})

module.exports = shopRouter;
