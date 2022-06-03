import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';
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

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
  postalCodeInput.addEventListener('click', findAddr);
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
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;
  const isPhoneNumber = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

  if (!isFullNameValid || !isPasswordValid) {
    return alert('이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.');
  }

  if (!isEmailValid) {
    return alert('이메일 형식이 맞지 않습니다.');
  }

  if (!isPasswordSame) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  if (isPhoneNumber.test(phoneNumber) === false) {
    return alert('휴대폰 번호를 입력해주세요.');
  }

  if (!postalCode || !address2) {
    return alert('주소를 입력해주세요.');
  }

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
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
