const express = require('express');
const adminRouter = express.Router();

const {
    httpGetAdminHome,
} = require('../controllers/admin.controller');

// adminRouter.get('/',httpGetAdminHome);

module.exports = adminRouter;
