function isLoggedIn(req, res, next) {
  if (req.session.adminId) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

function isLoggedOut(req, res, next) {
  if (!req.session.adminId) {
    next();
  } else {
    res.redirect('/admin');
  }
}
