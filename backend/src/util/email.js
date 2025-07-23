const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

async function send2FACode(email, code) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your FinMark 2FA Code',
    text: `Your one-time 2FA code is: ${code}. It will expire in 5 minutes.`,
  });
}

module.exports = { send2FACode };