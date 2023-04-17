const userDatabase = require('../schema/user.schema');
const { sendOtp, verifyOtp } = require('../config/twilio');
const { hashPassword } = require('../config/security');

async function checkUserExistOrNot(phoneNumber) {
  try {
    const user = await userDatabase.findOne({ phone: phoneNumber });
    if (user) {
      await sendOtp(phoneNumber);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error checking user existence');
  }
}

async function verifyPhoneNumber(phoneNumber, otp) {
  try {
    const isVerified = await verifyOtp(phoneNumber, otp);
    if (isVerified) {
      const user = await userDatabase.findOne({ phone: phoneNumber });
      return { status: true, user };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error verifying phone number');
  }
}

async function sendVerificationSignup(phoneNumber) {
  try {
    const user = await userDatabase.findOne({ phone: phoneNumber });
    if (!user) {
      await sendOtp(phoneNumber);
      return true;
    } else {
      return false; //phone number already registered
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error sending verification code');
  }
}

async function submitSignup({ username, email, phone, password, otp }) {
  try {
    const isVerified = await verifyOtp(phone, otp);
    const hashedPassword = await hashPassword(password);
    
    if (isVerified) {
      const user = new userDatabase({
        username: username,
        email: email,
        phone: phone,
        password: hashedPassword,
        status: true,
      });

      await user.save();
      return { status: true, user };
    } else {
      return { status: false, message: 'invalid OTP' };
    }
  } catch (error) {
    console.error(error);
    if (error.status === 404) {
      throw new Error('Twilio resource not found');
    } else {
      throw new Error('Error submitting signup');
    }
  }
}

module.exports = {
  checkUserExistOrNot,
  verifyPhoneNumber,
  sendVerificationSignup,
  submitSignup,
};
