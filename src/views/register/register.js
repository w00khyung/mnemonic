import * as Api from '/api.js';
import { validateEmail } from '../useful-functions.js';
import { navRender } from '../components/header.js';

// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector('#fullNameInput');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const receiverPhoneNumberInput = document.querySelector('#receiverPhoneNumber');
const postalCodeInput = document.querySelector('#postalCode');
const addressOneInput = document.querySelector('#address1');
const addressTwoInput = document.querySelector('#address2');
const submitButton = document.querySelector('#submitButton');
const sendMail = document.querySelector('#sendMail');

// 이메일 확인 란
const checkMailLabel = document.querySelector('#checkMailLabel');
const checkMailBtn = document.querySelector('#checkMailBtn');
const checkMailInput = document.querySelector('#checkMailInput');

// 이메일 인증 확인 여부
let checkMailBoolean = false;

// laebl 확인용
const nameLabel = document.querySelector('#nameLabel');
const passwordLabel = document.querySelector('#passwordLabel');
const addressLabel = document.querySelector('#addressLabel');
const phoneLabel = document.querySelector('#phoneLabel');
const passwordConfirmLabel = document.querySelector('#passwordConfirmLabel');
// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
  postalCodeInput.addEventListener('click', findAddr);
  sendMail.addEventListener('click', handleEmail);
  checkMailBtn.addEventListener('click', handleCheckMail);
}

navRender();
addAllEvents();

// Daum api
function findAddr() {
  new daum.Postcode({
    oncomplete(data) {
      const roadAddr = data.roadAddress;
      const jibunAddr = data.jibunAddress;

      postalCodeInput.value = data.zonecode;
      if (roadAddr !== '') {
        addressOneInput.value = roadAddr;
      } else if (jibunAddr !== '') {
        addressOneInput.value = jibunAddr;
      }

      addressTwoInput.focus();
    },
  }).open();
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const phoneNumber = receiverPhoneNumberInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = addressOneInput.value;
  const address2 = addressTwoInput.value;

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;

  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;
  const isPhoneNumber = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  let errorCount = 0;
  if (!isFullNameValid) {
    nameLabel.textContent = '이름은 2글자 이상이어야합니다.';
    nameLabel.style.color = 'red';
    errorCount += 1;
  } else {
    nameLabel.textContent = '성공했습니다.';
    nameLabel.style.color = 'green';
  }
  if (!isPasswordValid) {
    passwordLabel.textContent = '비밀번호는 4글자 이상이어야 합니다.';
    passwordLabel.style.color = 'red';
    errorCount += 1;
  } else {
    passwordLabel.textContent = '성공했습니다.';
    passwordLabel.style.color = 'green';
  }

  if (!checkMailBoolean) {
    checkMailLabel.textContent = '이메일을 입력하세요.';
    checkMailLabel.style.color = 'red';
    errorCount += 1;
    checkMailLabel.classList.remove('hidden');
  }

  if (!isPasswordSame) {
    passwordConfirmLabel.textContent = '비밀번호가 일치하지 않습니다.';
    passwordConfirmLabel.style.color = 'red';
    errorCount += 1;
  } else {
    passwordConfirmLabel.textContent = '성공했습니다.';
    passwordConfirmLabel.style.color = 'green';
  }

  if (isPhoneNumber.test(phoneNumber) === false) {
    phoneLabel.textContent = '휴대폰 번호를 입력해주세요.';
    phoneLabel.style.color = 'red';
    errorCount += 1;
  } else {
    phoneLabel.textContent = '성공했습니다.';
    phoneLabel.style.color = 'green';
  }

  if (!postalCode || !address2) {
    addressLabel.textContent = '주소를 입력해주세요.';
    addressLabel.style.color = 'red';
    errorCount += 1;
  } else {
    addressLabel.textContent = '성공했습니다.';
    addressLabel.style.color = 'green';
  }

  if (errorCount === 0) {
    // 회원가입 api 요청
    try {
      const data = {
        fullName,
        email,
        password,
        phoneNumber,
        address: {
          postalCode,
          address1,
          address2,
        },
      };

      await Api.post('/api/register', data);

      alert(`정상적으로 회원가입되었습니다.`);

      // 로그인 페이지 이동
      window.location.href = '/login';
    } catch (err) {
      console.error(err.stack);
      alert(
        `문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`
      );
    }
  }
}

// 이메일 인증 진행
async function handleEmail(e) {
  e.preventDefault();

  const email = emailInput.value;
  // 잘 입력되는지 확인
  const isEmailValid = validateEmail(email);

  const mail = {
    email,
  };

  if (!isEmailValid) {
    checkMailLabel.textContent = '이메일 형식이 맞지 않습니다.';
    checkMailLabel.style.color = 'red';
    checkMailLabel.classList.remove('hidden');
  } else {
    try {
      // 데이터베이스에 이메일이 있는지 확인합니다.
      const checkUseMailResult = await Api.post('/api/checkUserMail', mail);
      if (checkUseMailResult.result === 'valid') {
        // 이메일이 있으면 종료합니다.
        checkMailLabel.classList.remove('hidden');
        checkMailLabel.textContent = '이메일이 사용중입니다.';
        checkMailLabel.style.color = 'red';
      } else {
        try {
          // 이메일 확인-> 디비랑 회원가입할려는 유저 이메일 메일란에 코드가 전달
          await Api.post('/api/sendMessage', mail);
          checkMailLabel.textContent = '이메일을 인증하세요.';
          checkMailLabel.style.color = 'blue';
          // 이메일을 확인합시다.
          checkMailLabel.classList.remove('hidden');
          checkMailBtn.classList.remove('hidden');
          checkMailInput.classList.remove('hidden');
        } catch (err) {
          alert(
            `문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`
          );
        }
      }
    } catch (err) {
      alert(
        `문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`
      );
    }
  }
}

async function handleCheckMail(e) {
  e.preventDefault();
  const checkCode = {
    checkCode: checkMailInput.value,
  };
  // 유저가 적은 코드와 디비에 있는 코드 비교
  const checkCodeResult = await Api.post(
    '/api/sendMessage/checkCode',
    checkCode
  );
  // 결과 값으로 success와 fail을 받음 success이면 디비에서 해당 코드가 삭제됨
  if (checkCodeResult.result === 'success') {
    checkMailLabel.textContent = '완료했습니다.';
    checkMailLabel.style.color = 'green';
    checkMailBoolean = true;
    checkMailBtn.disabled = true;
    checkMailInput.disabled = true;
    emailInput.disabled = true;
    sendMail.disabled = true;
  } else {
    checkMailLabel.style.color = 'red';
    checkMailLabel.textContent = '인증코드와 맞지 않습니다.';
  }
}
