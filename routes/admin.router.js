const express = require('express');
const adminRouter = express.Router();

// const {
//     httpGetAdminHome,
// } = require('../controllers/admin.controller');

adminRouter.get('/',(req,res)=>{
    res.render('admin/dashboard')
});


module.exports = adminRouter;
