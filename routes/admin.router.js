const express = require('express');
const adminRouter = express.Router();

const {
    httpGetDashBoard,
    httpGetLogin,
    httpPostLogin,
    httpPostLogout,

} = require('../controllers/admin.controller');

adminRouter.get('/',httpGetDashBoard);
adminRouter.get('/login',httpGetLogin)
adminRouter.post('/login', httpPostLogin)
adminRouter.post('/logout', httpPostLogout)


module.exports = adminRouter;
