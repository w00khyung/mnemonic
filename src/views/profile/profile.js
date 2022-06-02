import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';
import { navRender } from '../components/header.js';

navRender();

// get userInfo
const userList = await Api.get(`/api/userlist`);
const email = sessionStorage.getItem('email');
let userId = '';
let userName = '';
let userEmail = '';

for (let i = 0; i < userList.length; i++) {
  if (userList[i].email === email) {
    userId = userList[i]._id;
    userName = userList[i].fullName;
    userEmail = userList[i].email;
  }
}

// input name, email default value setting
function readOnlyInputs() {
  const inputBox = document.querySelector('.register-user-form-left-input');

  const readOnlyInput = `
<!-- name -->
<div class="field">
  <label class="label" for="fullNameInput">이름</label>
  <input
    readonly
    class="input success"
    id="fullNameInput"
    type="text"
    value="${userName}"
    autocomplete="on"
  />
</div>

<!-- email -->
<div class="field">
  <label class="label" for="emailInput">이메일</label>
  <input
    readonly
    class="input error"
    id="emailInput"
    type="email"
    value="${userEmail}"
    autocomplete="on"
  />
</div>
`;
  return inputBox.insertAdjacentHTML('afterbegin', readOnlyInput);
}

readOnlyInputs();

// profile name setting
const titleName = document.querySelector('.mypage-user-profile-name');
titleName.innerHTML = userName;

// form DOM
const fullNameInput = document.querySelector('#fullNameInput');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const receiverPhoneNumberInput = document.querySelector('#receiverPhoneNumber');
const postalCodeInput = document.querySelector('#postalCode');
const addressOneInput = document.querySelector('#address1');
const addressTwoInput = document.querySelector('#address2');
const profileUpdateBtn = document.querySelector('.profile-update-btn');
const userDeleteBtn = document.querySelector('.profile-user-data-delete');


// modal DOM
const body = document.querySelector('body');
const modal = document.querySelector('.mypage-confirm-modal');
const currentPasswordInput = document.querySelector('#currentPasswordInput');
const clearBtn = document.querySelector('.clear-btn');
const updateBtn = document.querySelector('.update-btn');

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  postalCodeInput.addEventListener('click', findAddr);
  profileUpdateBtn.addEventListener('click', displayModal);
  clearBtn.addEventListener('click', backToProfile);
  updateBtn.addEventListener('click', handleSubmit);
  userDeleteBtn.addEventListener('click', handleDelete);
}

addAllEvents();

// open modal
function displayModal(e) {
  e.preventDefault();

  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const phoneNumber = receiverPhoneNumberInput.value;
  const postalCode = postalCodeInput.value;
  const address2 = addressTwoInput.value;

  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;
  const isPhoneNumber = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

  if (!isPasswordValid) {
    alert('비밀번호는 4글자 이상이어야 합니다.');
    return passwordInput.focus();
  }

  if (!isPasswordSame) {
    alert('비밀번호가 일치하지 않습니다.');
    return passwordConfirmInput.focus();
  }

  if (isPhoneNumber.test(phoneNumber) === false) {
    alert('휴대폰 번호를 입력해주세요.');
    return receiverPhoneNumberInput.focus();
  }

  if (!postalCode) {
    alert('주소를 입력해주세요.');
    return postalCode.focus();
  }

  if (!address2) {
    alert('상세주소를 입력해주세요.');
    return addressTwoInput.focus();
  } else {
    body.style.overflow = 'hidden';
    modal.style.display = 'flex';
  }
}

// back to profile
function backToProfile(e) {
  e.preventDefault();
  body.style.overflow = 'visible';
  modal.style.display = 'none';
}

// Daum api
function findAddr() {
  new daum.Postcode({
    oncomplete: function (data) {
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

// update user info
async function handleSubmit(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const phoneNumber = receiverPhoneNumberInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = addressOneInput.value;
  const address2 = addressTwoInput.value;
  const currentPassword = currentPasswordInput.value;

  // 회원정보 수정 api 요청
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
      currentPassword,
    };

    await Api.patch(`/api/users`, userId, data);

    alert('정상적으로 수정되었습니다.');

    // 로그인 페이지 이동
    window.location.href = '/mypage';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function handleDelete(e) {
  e.preventDefault();

  const confirm = window.confirm("정말 탈퇴하시겠습니까?");
  if(!confirm) return;

  // 회원정보 수정 api 요청
  try {
    await Api.delete('/api/users');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    alert('정상적으로 삭제되었습니다.');

    // 로그인 페이지 이동
    window.location.href = '/';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}