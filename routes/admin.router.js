const express = require('express');
const adminRouter = express.Router();

const {
    httpGetDashBoard,
    httpGetLogin,
    httpPostLogin,
    httpPostLogout,

} = require('../controllers/admin.controller');

const {isAdminLoggedIn,isAdminLoggedOut, isLoggedIn} = require('../middlewares/auth.handler');

adminRouter.get('/',isAdminLoggedIn,httpGetDashBoard);
adminRouter.get('/login',isAdminLoggedOut,httpGetLogin)
adminRouter.post('/login',isAdminLoggedOut, httpPostLogin)
adminRouter.post('/logout',isAdminLoggedIn, httpPostLogout)


adminRouter.get('*');



module.exports = adminRouter;
