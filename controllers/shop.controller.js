function httpGetHome(req, res) {
  res.status(200).render('shop/home');
}

function httpGet404(req, res) {
  res.status(404).render('shop/404');
}






module.exports = {
  httpGetHome,


  httpGet404,
};
