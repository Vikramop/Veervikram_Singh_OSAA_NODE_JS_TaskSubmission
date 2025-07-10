const OTP = require('../models/Otp');

exports.generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.storeOTP = async (userId, otp) => {
  await OTP.create({
    userId,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    used: false,
  });
};

// exports.validateOTP = async (userId, inputOtp) => {
//   console.log('🔍 Checking OTP for user:', userId);

//   const record = await OTP.findOne({ userId });
//   console.log('📦 Found OTP Record:', record);

//   if (!record) {
//     console.log('❌ No OTP record found for this user.');
//     throw new Error('Invalid or expired OTP');
//   }

//   console.log('✅ Stored OTP:', record.otp, '| Entered OTP:', inputOtp);

//   if (record.OTP !== inputOtp) {
//     console.log('❌ OTP mismatch!');
//     throw new Error('Invalid or expired OTP');
//   }

//   await OTP.deleteOne({ _id: record._id });
//   console.log('✅ OTP validated and deleted.');
// };

exports.validateOTP = async (userId, inputOtp) => {
  console.log('🔍 Checking OTP for user:', userId);

  const record = await OTP.findOne({ userId });
  console.log('📦 Found OTP Record:', record);

  if (!record) {
    console.log('❌ No OTP record found for this user.');
    throw new Error('Invalid or expired OTP');
  }

  // 🔧 Normalize both sides
  const storedOtp = record.otp.toString().trim();
  const enteredOtp = inputOtp.toString().trim();

  console.log('✅ Stored OTP:', storedOtp, '| Entered OTP:', enteredOtp);

  if (storedOtp !== enteredOtp) {
    console.log('❌ OTP mismatch!');
    throw new Error('Invalid or expired OTP');
  }

  await OTP.deleteOne({ _id: record._id });
  console.log('✅ OTP validated and deleted.');
};
