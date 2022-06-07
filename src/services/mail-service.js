const nodemailer = require('nodemailer');
// nodemailer 로 gmail transport 생성하기

require('dotenv').config();

const user = process.env.EMAIL_CERTIFICATION_USER;
const pass = process.env.EMAIL_CERTIFICATION_PASS;

async function sendEmail(email, mailHashedCode) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: 'shoppingmal@elice.com',
    to: email,
    subject: '쇼핑몰 6팀입니다.',
    text: `${email}님 안녕하세요? 해당 코드를 이메일 인증란에 인증해주세요!\n${mailHashedCode}`,
  };

  transporter.sendMail(mailOptions, (err, result) => {
    if (err) {
      return err;
    }
  });
}
exports.sendEmail = sendEmail;

async function makeCode() {
  const randomCode = Math.floor(Math.random() * 10 ** 8)
    .toString()
    .padStart(8, '0');

  return randomCode;
}
exports.makeCode = makeCode;
