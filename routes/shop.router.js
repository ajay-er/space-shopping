const express = require('express');
const shopRouter = express.Router();

const shopController = require('../controllers/shop.controller');

shopRouter.get('/dd',(req,res)=>{
    res.render('admin/transactions',{showSellerCard:false,showSellersLIst:false});
})

module.exports = shopRouter;
