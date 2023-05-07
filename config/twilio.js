const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICES_SID;
const client = require('twilio')(accountSid, authToken);

function sendOtp(phoneNumber) {
  client.verify.v2
    .services(serviceSid)
    .verifications.create({ to: '+91' + phoneNumber, channel: 'sms' })
    .then((verification) => console.log(verification.sid));
}

function verifyOtp(phoneNumber, otp) {
 return client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: '+91' + phoneNumber, code: otp })
    .then((verification_check) => {
      console.log(verification_check.status);
      if (verification_check.status == 'approved') {
        return true;
      } else {
        return false;
      }
    });
}

module.exports = {
  sendOtp,
  verifyOtp,
};
