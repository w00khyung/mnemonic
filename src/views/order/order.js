import * as Api from '../api.js';
import { navRender } from '../components/header.js';
navRender();
const checkoutButton = document.querySelector('#checkoutButton');
const requestSelectBox = document.querySelector('#requestSelectBox');
const receiverName = document.querySelector('#receiverName');
const receiverPhoneNumber = document.querySelector('#receiverPhoneNumber');
const searchAddressButton = document.querySelector('#searchAddressButton');
const postalCode = document.querySelector('#postalCode');
const address1 = document.querySelector('#address1');
const address2 = document.querySelector('#address2');
const deliveryFeeInfo = document.querySelector('#deliveryFee');
const productsTotalInfo = document.querySelector('#productsTotal');
const orderTotalInfo = document.querySelector('#orderTotal');
const productsTitleInfo = document.querySelector('#productsTitle');
const requestInput = document.querySelector('.custom-request');
const requestInputValue = document.querySelector('#customRequest');

const cartItemInfo = [];
const totalAmount = 0;
let requestValue;
async function deliveryInfo() {
  if (!receiverName.value) {
    return alert('이름을 입력하세요');
  }
  if (!receiverPhoneNumber.value || !Number(receiverPhoneNumber.value)) {
    return alert('연락처를 다시 입력하세요');
  }
  if (!postalCode.value || !address2.value) {
    return alert('주소를 입력하세요');
  }
  requestText();
  if (requestValue === '0') {
    requestValue = '요청 없음';
  }
  const data = {
    recipient: {
      name: receiverName.value,
      phoneNumber: receiverPhoneNumber.value,
      address: {
        postalCode: postalCode.value,
        address1: address1.value,
        address2: address2.value,
      },
      request: requestValue,
    },
    purchaseOrderInfo: {
      products: [cartItemInfo],
      totalAmount: totalAmount,
    },
  };
  try {
    await Api.post('/api/orders/', data);
    alert('결제 및 주문이 정상적으로 완료되었습니다.');
    window.location.href = './complete';
  } catch (err) {
    alert('문제발생' + err);
  }
  // 주문 완료 페이지로 이동
}

// 주소 api 이용해서 주소 찾기
function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';
      let extraAddr = '';

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr +=
            extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
      } else {
      }

      postalCode.value = data.zonecode;
      address1.value = `${addr} ${extraAddr}`;
      address2.placeholder = '상세 주소를 입력해 주세요.';
      address2.focus();
    },
  }).open();
}

function cartPurchaseInfo() {
  let productsTotal = 0;
  const deliveryFee = 3000;
  let totalAmount = 0;

  deliveryFeeInfo.innerHTML = `${deliveryFee.toLocaleString()}원`;
  for (let i = 0; i < localStorage.length; i++) {
    const data = localStorage.getItem(localStorage.key(i));
    const objectData = JSON.parse(data);
    productsTotal += objectData.price * objectData.quantity;
    cartItemInfo.push(`${objectData.name} / ${objectData.quantity}`);
  }

  cartItemInfo.forEach((item) => {
    productsTitleInfo.innerHTML += `${item}개<br>`;
  });
  productsTotalInfo.innerText = `${productsTotal.toLocaleString()}원`;
  totalAmount = productsTotal + deliveryFee;
  orderTotalInfo.innerText = `${totalAmount.toLocaleString()}원`;
}
function requestText() {
  if (requestSelectBox.value === '0') {
    requestValue = '요청 없음';
  }
  if (requestSelectBox.value === '6') {
    requestInput.style.display = 'flex';
    requestValue = requestInputValue.value;
  } else {
    requestInput.style.display = 'none';
    requestValue = requestSelectBox.value;
  }
  return requestValue;
}
cartPurchaseInfo();

checkoutButton.addEventListener('click', deliveryInfo);
requestSelectBox.addEventListener('change', requestText);
searchAddressButton.addEventListener('click', searchAddress);
