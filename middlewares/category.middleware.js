const { fetchCategories } = require('../models/category.model');

async function middlewareCategory(req, res, next) {
    try {
      const categoryResult = await fetchCategories();
      res.locals.categories = categoryResult.categories;
      next();
    } catch (error) {
      next(error);
    }
  }

  module.exports = middlewareCategory;