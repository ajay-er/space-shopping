const { handleError } = require('../middlewares/error.handler');

const { fetchAllProducts } = require('../models/product.model');

async function httpGetProducts(req, res) {
    try {
      const response = await fetchAllProducts();
      if (response.status) {
        return res.render('admin/products', { product: response.products });
      } else {
        return res.render('admin/products', { products: [] });
      }
    } catch (error) {
      handleError(res, error);
    }
  }
  
  async function httpGetAddProduct(req, res) {
    try {
      return res.render('admin/add-products');
    } catch (error) {
      handleError(res, error);
    }
  }
  
  async function httpPostAddProduct(req, res) {
    const productId = req.body.params;
    try {
    } catch (error) {
      handleError(res, error);
    }
  }

  module.exports = {
    httpGetProducts,
    httpGetAddProduct,
    httpPostAddProduct,
  }