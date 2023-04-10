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
  const { phone } = req.body;
  isPhoneNumberExist(phone).then((response) => {
    if (response) {
      req.session.phone = phone;
      return res.render('shop/logins/otp-verify',{phone});
    } else {
      let message = 'Phone number not registered';
      return res.redirect('/otp-login?message=' + message);
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
        res.redirect('/otp-verify?message=Incorrect OTP. Please try again.');
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
