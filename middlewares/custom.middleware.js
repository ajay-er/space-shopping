const { fetchCategories } = require('../models/category.model');
const { handleError } = require('./error.handler');

async function categoryMiddleware(req, res, next) {
  try {
    const categoryResult = await fetchCategories();
    res.locals.categories = categoryResult.categories;
    next();
  } catch (error) {
    handleError(res,error)
  }
}

async function LoggedInMiddleware(req, res, next) {
  try {
    if(req.session.user){
      res.locals.user= req.session.user;
    }
    next();
  } catch (error) {
    handleError(res,error)
  }
}

module.exports = { categoryMiddleware, LoggedInMiddleware };
