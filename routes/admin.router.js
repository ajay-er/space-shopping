const express = require('express');
const adminRouter = express.Router();

const upload = require('../config/multer');

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
  httpGetEditProduct,
  httpPutProduct,
  httpPutProductDetails,
} = require('../controllers/product.controller');

const {
  httpGetCategories,
  httpPostCategories,
  httpPutCategory,
} = require('../controllers/category.controller');

const {
  isAdminLoggedIn,
  isAdminLoggedOut,
} = require('../middlewares/auth.handler');

adminRouter.get('/', isAdminLoggedIn, httpGetDashBoard);
adminRouter.get('/login', isAdminLoggedOut, httpGetLogin);
adminRouter.post('/login', isAdminLoggedOut, httpPostLogin);
adminRouter.get('/logout', isAdminLoggedIn, httpGetLogout);

adminRouter.get('/categories', isAdminLoggedIn, httpGetCategories);
adminRouter.post('/categories', isAdminLoggedIn, httpPostCategories);
adminRouter.put('/category-status', isAdminLoggedIn, httpPutCategory);

adminRouter.get('/users', isAdminLoggedIn, httpGetUsers);
adminRouter.put('/user-status', isAdminLoggedIn, httpPutBlockUser);

adminRouter.get('/products', isAdminLoggedIn, httpGetProducts);
adminRouter.get('/add-products', isAdminLoggedIn, httpGetAddProduct);
adminRouter.post('/add-products',upload.array('productImage',4), isAdminLoggedIn, httpPostAddProduct);

adminRouter.get('/edit-product/:id',isAdminLoggedIn,httpGetEditProduct);
adminRouter.put('/edit-product',isAdminLoggedIn,httpPutProductDetails);
adminRouter.put('/product-status/:id',isAdminLoggedIn,httpPutProduct);


adminRouter.get('*', httpGet404);

module.exports = adminRouter;
