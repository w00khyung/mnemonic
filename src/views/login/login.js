import * as Api from '/api.js';
import { validateEmail, setCookie } from '/useful-functions.js';
import { navRender } from '../components/header.js';
import { pageScroll } from '../components/pagescroll.js';

navRender();
pageScroll();

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const submitButton = document.querySelector('#submitButton');

// 라벨들!!
const emailLabel = document.querySelector('.emailLabel');
const passwordLabel = document.querySelector('.passwordLabel');

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}

navRender();
addAllEvents();

passwordInput.addEventListener('keydown', async () => {
  await checkpassword();
});
passwordInput.addEventListener('keyup', async () => {
  await checkpassword();
});

emailInput.addEventListener('keydown', async () => {
  await checkEmail();
});
emailInput.addEventListener('keyup', async () => {
  await checkEmail();
});

async function checkEmail() {
  const email = emailInput.value;
  const isEmailValid = validateEmail(email);
  if (!isEmailValid) {
    emailLabel.textContent = '이메일 형태가 맞는지 확인해주세요.';
    emailLabel.style.color = 'red';
  } else {
    emailLabel.textContent = '성공했습니다.';
    emailLabel.style.color = 'green';
  }
}
async function checkpassword() {
  const password = passwordInput.value;
  const isPasswordValid = password.length >= 4;

  if (!isPasswordValid) {
    passwordLabel.textContent = '패스워드가 4글자 이상인지 확인해주세요.';
    passwordLabel.style.color = 'red';
  } else {
    passwordLabel.textContent = '성공했습니다.';
    passwordLabel.style.color = 'green';
  }
}
// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  let errorCount = 0;
  if (!isEmailValid || !isPasswordValid) {
    errorCount += 1;
  }
  if (errorCount < 1) {
    // 로그인 api 요청
    const data = { email, password };

    try {
      const result = await Api.post('/api/login', data);
      console.log(result);
      // 로그인 성공, 토큰을 쿠키에 저장
      setCookie('email', email);
      alert(`정상적으로 로그인되었습니다.`);
      // 로그인 성공

      // 기본 페이지로 이동
      window.location.href = '/';
    } catch (err) {
      alert(err.message);
    }
  } else {
    return alert(
      '비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.'
    );
  }
}
