function isLoggedIn(req, res, next) {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

function isLoggedOut(req, res, next) {
  if (!req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect('/admin');
  }
}
