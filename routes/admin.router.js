const express = require('express');
const adminRouter = express.Router();

const {
    httpGetDashBoard,
    httpGetLogin,
    httpPostLogin,
    httpGetLogout,
    httpGetUsers,
    httpPutBlockUser,
    httpGet404,

} = require('../controllers/admin.controller');

const {isAdminLoggedIn,isAdminLoggedOut} = require('../middlewares/auth.handler');

adminRouter.get('/',isAdminLoggedIn,httpGetDashBoard);
adminRouter.get('/login',isAdminLoggedOut,httpGetLogin);
adminRouter.post('/login',isAdminLoggedOut, httpPostLogin);
adminRouter.get('/logout',isAdminLoggedIn, httpGetLogout);

adminRouter.get('/users',isAdminLoggedIn,httpGetUsers);
adminRouter.put('/block-user/:userId/:action',isAdminLoggedIn,httpPutBlockUser);

adminRouter.get('*',httpGet404);



module.exports = adminRouter;
