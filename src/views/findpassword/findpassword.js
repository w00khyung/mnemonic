import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';
import { sendEmail, makeCode } from '../services/mail-service';
const checkMailInput = document.querySelector('#checkMailInput');
const sendMailBtn = document.querySelector('#sendMail');
const checkMailCode = document.querySelector('#checkMailCode');
const checkMailBtn = document.querySelector('#checkMailBtn');

async function findPasswordReset() {
  const email = checkMailInput.value;

  const mail = {
    email,
  };

  await Api.post('/api/sendMessage', mail);
  // checkMailCode.style.display = 'block';
  // checkMailBtn.style.display = 'block';
}

async function checkEmail() {
  const checkCode = {
    checkCode: checkMailCode.value,
  };
  const randompassword = makeCode();

  await User.updateOne(
    { email },
    {
      // hashPassword 로 업데이트 하기
      // passwordReset
      password: hashPassword(randompassword),
      passwordReset: true,
    }
  );
  const checkCodeResult = await Api.post('/api/register/checkCode', checkCode);
  console.log(checkCode);
}
sendMailBtn?.addEventListener('click', findPasswordReset);
checkMailBtn?.addEventListener('click', checkEmail);
