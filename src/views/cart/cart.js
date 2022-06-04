import * as Api from '/api.js';
import { navRender } from '../components/header.js';

navRender();

const cartProductsContainer = document.querySelector('#cartProductsContainer');
const checkboxAll = document.querySelector('.checkboxAll');
const allDeleteBtn = document.querySelector('.allDeleteBtn');
const selectDeleteBtn = document.querySelector('.selectDeleteBtn');
const deliveryFeeInfo = document.querySelector('#deliveryFee');
const productsCountInfo = document.querySelector('#productsCount');
const productsTotalInfo = document.querySelector('#productsTotal');
const orderTotalInfo = document.querySelector('#orderTotal');
const orderPaymentBtn = document.querySelector('#purchaseButton');

let itemsPrice = [];
//const itemquantityChange = document.querySelector('.itemquantity');

function checkboxAllSelect() {
  const checkboxs = document.querySelectorAll('input[type="checkbox"]');

  for (let i = 0; i < checkboxs.length; i++) {
    if (checkboxAll.checked === true) {
      checkboxs[i].checked = true;
    } else {
      checkboxs[i].checked = false;
    }
  }
}
function cartPurchaseInfo() {
  let productsCount = 0;
  let productsTotal = 0;
  let deliveryFee = 3000;

  deliveryFeeInfo.innerHTML = `${deliveryFee.toLocaleString()}원`;
  for (let i = 0; i < localStorage.length; i++) {
    const data = localStorage.getItem(localStorage.key(i));
    const objectData = JSON.parse(data);
    productsCount += Number(objectData.quantity);
    productsTotal += Number(objectData.price * objectData.quantity);
  }

  productsCountInfo.innerText = `${productsCount.toLocaleString()}개`;
  productsTotalInfo.innerText = `${productsTotal.toLocaleString()}원`;
  orderTotalInfo.innerText = `${(
    productsTotal + deliveryFee
  ).toLocaleString()}`;
}

function cartDataDisplay() {
  // localStorage에 저장된 값 가져와서 장바구니에 출력
  if (localStorage.length !== 0) {
    const emptyCart = document.querySelector('.emptyCart');
    emptyCart.style.display = 'none';
  }
  for (let i = 0; i < localStorage.length; i += 1) {
    const data = localStorage.getItem(localStorage.key(i));
    const objectData = JSON.parse(data);

    console.log();
    //사진이랑 품목 클릭시 주소 이동 부분 변수값 고민 중 나중에 수정 필요
    cartProductsContainer.insertAdjacentHTML(
      'beforeend',
      `
    <div class="cart-product-item" id="${objectData._id}">
       <input type="checkbox">
        <p><a href="/product-detail"><img src="${objectData.imagePath}" alt="" /></a></p>
      <div class="content">
        <p><a href="/product-detail">${objectData.name}</a></p>
        </div>
        <p class="price">${objectData.price}</p>
        <input type="number" class="itemquantity" min="1" max="99" value="${objectData.quantity}" style="width:50px;height:30px"></input>
    </div>
    `
    );
  }
}

function selectItemDelete() {
  const checkboxs = document.querySelectorAll('input[type="checkbox"]');

  for (let i = 1; i < checkboxs.length; i++) {
    if (checkboxs[i].checked == true) {
      localStorage.removeItem(checkboxs[i].parentElement.id);
    }
    window.location.reload();
  }
}

cartDataDisplay();
cartPurchaseInfo();
allDeleteBtn?.addEventListener('click', () => {
  window.localStorage.clear();
  window.location.reload();
});
checkboxAll?.addEventListener('click', checkboxAllSelect);
selectDeleteBtn?.addEventListener('click', selectItemDelete);
orderPaymentBtn?.addEventListener('click', () => {
  location.href = '/order';
});
document.querySelectorAll('.itemquantity').forEach((items) => {
  items.addEventListener('change', () => {
    const priceKey = JSON.parse(localStorage.getItem(items.parentElement.id));
    const changeQuantity = Number(items.value);
    priceKey.quantity = changeQuantity;
    console.log(priceKey);
    localStorage.setItem(priceKey._id, JSON.stringify(priceKey));
    window.location.reload();
  });
});
