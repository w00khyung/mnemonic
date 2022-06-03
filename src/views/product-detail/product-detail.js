import * as Api from '/api.js';
import { addCommas } from '/useful-functions.js';
import { navRender } from '../components/header.js';

navRender();

let productImgSrc = '';
let productBrand = '';
let productName = '';
let productContent = '';
let productPrice = '';

const productList = await Api.get(`/api/product/productlist`);
const currentProductId = sessionStorage.getItem('productId');

for (let i = 0; i < productList.length; i++) {
  if (currentProductId === productList[i]._id) {
    productImgSrc = productList[i].imagePath;
    productBrand = productList[i].brand;
    productName = productList[i].name;
    productContent = productList[i].content;
    productPrice = addCommas(productList[i].price);
  }
}

function productDetail() {
  const wrap = document.querySelector('.product-detail-wrap');
  const productDetailTemplate = `
<section class="product-detail-page">
<div class="product-detail-page-left">
  <img class="productt-detail-page-img" src="${productImgSrc}" alt="제품" />
</div>
<div class="product-detail-page-right">
  <div class="product-detail-page-text">
    <p class="productt-detail-page-brand">${productBrand}</p>
    <p class="productt-detail-page-name">${productName}</p>
    <p class="productt-detail-page-price">${productPrice}</p>
    <p class="productt-detail-page-content">${productContent}</p>
  </div>
  <div class="product-detail-page-btns">
    <button class="button">장바구니 추가하기</button>
    <button class="button is-black">바로 구매하기</button>
  </div>
</div>
</section>
`;

  wrap.innerHTML = productDetailTemplate;
}

productDetail();
