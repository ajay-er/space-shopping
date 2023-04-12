function isLoggedIn(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

function isLoggedOut(req, res, next) {
  if (!req.session.loggedIn) {
    next();
  } else {
    res.redirect('/');
  }
}

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
