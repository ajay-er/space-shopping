const userDatabase = require('../schema/user.schema');
const { sendOtp, verifyOtp } = require('../config/twilio');

async function checkUserExistOrNot(phoneNumber) {
  const user = await userDatabase.findOne({ phone: phoneNumber });
  if (user) {
    return true;
  } else {
    return false;
  }
}

async function verifyPhoneNumber(phoneNumber, otp) {
  const isVerified = await verifyOtp(phoneNumber, otp);
  if (isVerified) {
    const user = await userDatabase.findOne({ phone: phoneNumber });
    return { user, status: true };
  } else {
    return { status: false };
  }
}

async function sendVerificationSignup(phoneNumber) {
  const user = await userDatabase.findOne({ phone: phoneNumber });
  if (!user) {
    console.log('🔼🔼otp🔼');
    sendOtp(phoneNumber);
    return true;
  } else {
    return false;
  }
}

async function submitSignup(userData) {
  try {
    const { username, email, phone, password, otp } = userData;
    const isVerified = await verifyOtp(phone, otp);
    if (isVerified) {
      let user = new userDatabase({
        name: username,
        email: email,
        phone: phone,
        password: password,
        status: true,
      });

      try {
        await user.save();
        console.log('User saved successfully!');
        return { user, status: true };
      } catch (error) {
        console.error('Error saving user:', error);
        return { error: 'Error saving user' };
      }
    } else {
      return { error: 'Invalid OTP', status: false };
    }
  } catch (error) {
    console.error('Error submitting signup:', error);
    return { error: 'Error submitting signup' };
  }
}

module.exports = {
  checkUserExistOrNot,
  verifyPhoneNumber,
  sendVerificationSignup,
  submitSignup,
};
