const {
  isPhoneNumberExist,
  checkOTPcorrectOrNot,
} = require('../models/user.model');

function httpGetHome(req, res) {
  res.status(200).render('shop/home');
}

function httpGet404(req, res) {
  res.status(404).render('shop/404');
}

function httpGetSignup(req, res) {
  res.render('shop/logins/signup');
}

function httpGetLogin(req, res) {
  res.render('shop/logins/login');
}

function httpGetOTP(req, res) {
  res.render('shop/logins/otp-login');
}

function httpVerifyPhone(req, res) {
  isPhoneNumberExist(req.body.phone).then((response) => {
    if (response) {
      req.session.phone = req.body.phone;
      res.render('shop/logins/otp-verify');
    } else {
      let message = 'Phone number not registered';
      res.redirect('/otplogin?message=' + message);
    }
  });
}

function httpPostVerifyOTP(req, res) {
  checkOTPcorrectOrNot(req.session.phone, req.body.otp).then(
    async (response) => {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;

        res.redirect('/');
      } else {
        res.redirect('/login?message=');
      }
    }
  );
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
