import * as Api from '/api.js';
import { addCommas } from '/useful-functions.js';
import { navRender } from '../components/header.js';

navRender();

const productList = await Api.get(`/api/product/productlist`);
const productUl = document.querySelector('.product-list-ul');

let productImagePath = '';
let productBrand = '';
let productName = '';
let productContent = '';
let productPrice = '';

const productCount = document.querySelector('.product-list-count');
productCount.innerHTML = `상품 ${productList.length}`;

for (let i = 0; i < productList.length; i++) {
  productImagePath = productList[i].imagePath;
  productBrand = productList[i].brand;
  productName = productList[i].name;
  productContent = productList[i].content;
  productPrice = addCommas(productList[i].price);

  const productTemplate = `
  <li class="product-list-box">
    <a href="/product-detail">
      <img class="product-list-box-img" src="${productImagePath}" alt="의상" />
      <p class="product-list-box-brand">${productBrand}</p>
      <p class="product-list-box-name">${productName}</p>
      <p class="product-list-box-content">${productContent}</p>
      <p class="product-list-box-price">${productPrice}원</p>
    </a>
  </li>
`;

  productUl.insertAdjacentHTML('afterbegin', productTemplate);

  const productListBox = document.querySelector('.product-list-box');

  productListBox.addEventListener('click', () => {
    sessionStorage.setItem('productId', productList[i]._id);
  });
}
