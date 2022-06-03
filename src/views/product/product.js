import * as Api from '/api.js';
import { navRender } from '../components/header.js';

navRender();

// const productList = await Api.get(`/api/userlist`);

const productUl = document.querySelector(".product-list-ul");

const productImgSrc = "https://pbs.twimg.com/media/EXePq-uU8AE1jf7.jpg";
const productBrand = "1";
const productName = "1";
const productContent = "1";
const productPrice = "1";

const productTemplate = `
<li>
<a href="/product-detail">
  <img class="product-list-box-img" src="${productImgSrc}" alt="의상" />
  <p class="product-list-box-brand">${productBrand}</p>
  <p class="product-list-box-name">${productName}</p>
  <p class="product-list-box-content">${productContent}</p>
  <p class="product-list-box-price">${productPrice}</p>
</a>
</li>
`;

productUl.insertAdjacentHTML('beforeend', productTemplate);

