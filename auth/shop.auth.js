function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

function isLoggedOut(req, res, next) {
  if (!req.session.userId) {
    next();
  } else {
    res.redirect('/');
  }
}

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
