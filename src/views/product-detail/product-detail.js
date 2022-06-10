import * as Api from '/api.js';
import { addCommas } from '/useful-functions.js';
import { navRender } from '../../components/header.js';
import { pageScroll } from '../../components/pagescroll.js';

navRender();
pageScroll();

let productImagePath = '';
let productBrand = '';
let productName = '';
let productContent = '';
let productPrice = '';
const productQuantity = 1;

const productList = await Api.get(`/api/product/productlist`);
const currentProductId = sessionStorage.getItem('productId');

for (let i = 0; i < productList.length; i++) {
  if (currentProductId === productList[i]._id) {
    productImagePath = productList[i].imagePath;
    productBrand = productList[i].brand;
    productName = productList[i].name;
    productContent = productList[i].content;
    productPrice = addCommas(productList[i].price);
  }
}

function renderProductDetail() {
  const wrap = document.querySelector('.product-detail-wrap');
  const productDetailTemplate = `
<section class="product-detail-page display-center">
<div class="product-detail-page-left display-center">
  <img class="productt-detail-page-img" src="${productImagePath}" alt="제품" />
</div>
<div class="product-detail-page-right">
  <div class="product-detail-page-text">
    <p class="productt-detail-page-brand">${productBrand}</p>
    <p class="productt-detail-page-name">${productName}</p>
    <p class="productt-detail-page-price">${productPrice}</p>
    <p class="productt-detail-page-content">${productContent}</p>
  </div>
  <div class="product-detail-page-btns">
    <button class="button add-cart-btn">장바구니 추가하기</button>
    <button class="button is-black" id="buyNow">바로 구매하기</button>
  </div>
</div>
</section>
`;

  wrap.innerHTML = productDetailTemplate;
}

renderProductDetail();

const addCartBtn = document.querySelector('.add-cart-btn');
const buyNowBtn = document.querySelector('#buyNow');
// modal DOM
const body = document.querySelector('body');
const modal = document.querySelector('.product-success-modal');

const data = {
  productId: currentProductId,
  imagePath: productImagePath,
  brand: productBrand,
  name: productName,
  content: productContent,
  price: productPrice,
  quantity: productQuantity,
};

const dataString = JSON.stringify(data);

addCartBtn.addEventListener('click', handleSubmit);
buyNowBtn.addEventListener('click', handleBuyNow);

function handleSubmit() {
  if (
    !sessionStorage.getItem('accessToken') ||
    !sessionStorage.getItem('refreshToken')
  ) {
    alert('로그인이 필요합니다.');
    return (window.location.href = '/login');
  }
  displayModal();
  localStorage.setItem(currentProductId, dataString);
}

function handleBuyNow() {
  if (!window.confirm('바로 구매하시겠습니까?')) {
    return;
  }
  localStorage.clear();
  localStorage.setItem(currentProductId, dataString);
  window.location.href = '/order/';
}
// open modal
function displayModal() {
  body.style.overflow = 'hidden';
  modal.style.display = 'flex';
}
