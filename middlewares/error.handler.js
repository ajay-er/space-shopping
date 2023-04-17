function handleError(res, error) {
    console.error(error);
    res.status(500).render('user/404', { error });
  }


  module.exports = { handleError };