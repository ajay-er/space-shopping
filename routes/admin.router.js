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
  httpGetGraphData,
  httpGetChartData,
  httpGetReport,
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
  httpGetBannerPage,
  httpEditBanner,
  httpAddBanner,
} = require('../controllers/banner.controller');

const { httpGetOrderPage, httpChangeOrderStatus } = require('../controllers/order.controller');

const { isAdminLoggedIn, isAdminLoggedOut } = require('../middlewares/auth.handler');

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
adminRouter.post(
  '/add-products',
  upload.array('productImage', 4),
  isAdminLoggedIn,
  httpPostAddProduct,
);

adminRouter.get('/edit-product/:id', isAdminLoggedIn, httpGetEditProduct);
adminRouter.put('/edit-product', isAdminLoggedIn, httpPutProductDetails);
adminRouter.put('/product-status/:id', isAdminLoggedIn, httpPutProduct);

adminRouter.get('/orders', isAdminLoggedIn, httpGetOrderPage);
adminRouter.post('/order-status', isAdminLoggedIn, httpChangeOrderStatus);

adminRouter.get('/graph', isAdminLoggedIn, httpGetGraphData);
adminRouter.get('/chart', isAdminLoggedIn, httpGetChartData);
adminRouter.get('/sales-report', isAdminLoggedIn, httpGetReport);

adminRouter.get('/banners', isAdminLoggedIn, httpGetBannerPage);
// adminRouter.post('/add-banner', upload.single('bannerImage'), isAdminLoggedIn, httpAddBanner);
adminRouter.post('/edit-banner', upload.single('bannerImage'), isAdminLoggedIn, httpEditBanner);

adminRouter.get('*', httpGet404);

module.exports = adminRouter;
