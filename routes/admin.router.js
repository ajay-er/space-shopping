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

const {
  httpGetProducts,
  httpGetAddProduct,
  httpPostAddProduct,
} = require('../controllers/product.controller');

const {
  httpGetCategories,
  httpPostCategories,
  httpDeleteCategory,
} = require('../controllers/category.controller');

const {
  isAdminLoggedIn,
  isAdminLoggedOut,
} = require('../middlewares/auth.handler');

adminRouter.get('/', isAdminLoggedIn, httpGetDashBoard);
adminRouter.get('/login', isAdminLoggedOut, httpGetLogin);
adminRouter.post('/login', isAdminLoggedOut, httpPostLogin);
adminRouter.get('/logout', isAdminLoggedIn, httpGetLogout);

adminRouter.get('/users', isAdminLoggedIn, httpGetUsers);
adminRouter.get('/products', isAdminLoggedIn, httpGetProducts);

adminRouter.get('/categories', isAdminLoggedIn, httpGetCategories);
adminRouter.post('/categories', isAdminLoggedIn, httpPostCategories);
adminRouter.put('/delete-category/:id',isAdminLoggedIn,httpDeleteCategory);

adminRouter.get('/add-products', isAdminLoggedIn, httpGetAddProduct);
adminRouter.post('/add-products/:id', isAdminLoggedIn, httpPostAddProduct);
adminRouter.put(
  '/block-user/:userId/:action',
  isAdminLoggedIn,
  httpPutBlockUser
);

adminRouter.get('*', httpGet404);

module.exports = adminRouter;
