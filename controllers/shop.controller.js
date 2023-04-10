function httpGetHome(req, res) {
  res.status(200).render('shop/home');
}

function httpGet404(req, res) {
  res.status(404).render('shop/404');
}

function httpGetSignup(req,res){
  res.render('shop/logins/signup'); 
}

function httpGetLogin(req,res){
  res.render('shop/logins/login');
}

function httpGetOTP(req,res){
  res.render('shop/logins/otp-login');
}

function httpVerifyPhone(req,res){
  console.log(req.body);
  res.render('shop/logins/otp-verify');
}

function httpPostVerifyOTP(req,res){
  res.render('shop/logins/login');
}



module.exports = {
  httpGetHome,
  httpGetSignup,
  httpGetLogin,
  httpGetOTP,
  httpVerifyPhone,
  httpPostVerifyOTP,

  httpGet404,
};
