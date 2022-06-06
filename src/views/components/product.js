import * as Api from '/api.js';
import { addCommas } from '/useful-functions.js';

const productList = await Api.get(`/api/product/productlist`);
const categoryList = await Api.get(`/api/category/categorylist`);
const currentURL = window.location.pathname;

// 기존 제품목록의 id
const productListId = productList.map((data) => data._id);
// 기존 제품목록의 카테고리 id
const productCategoryId = productList.map((data) => data.category._id);
// 카테고리 목록의 id
const categoryId = categoryList.map((data) => data._id);
// 카테고리 목록의 id와 일치하는 제품목록 조회
let sameCategory = [];
// 의류(0-4) 제품목록 조회
let clothingArr = [];
// 의류(5-11) 제품목록 조회
let accArr = [];

// 경로 변수
const isMain = currentURL === '/product/';
const isClothing = currentURL === '/product/clothing/';
const isAcc = currentURL === '/product/accessories/';
const isTop = currentURL === '/product/top/';
const isOuter = currentURL === '/product/outer/';
const isPants = currentURL === '/product/pants/';
const isOnepiece = currentURL === '/product/onepiece/';
const isSkirt = currentURL === '/product/skirt/';
const isBag = currentURL === '/product/bag/';
const isSneakers = currentURL === '/product/sneakers/';
const isShoes = currentURL === '/product/shoes/';
const isWatch = currentURL === '/product/watch/';
const isHat = currentURL === '/product/hat/';
const isSocks = currentURL === '/product/socks/';

clothingProductList();
accProductList();
individualProductList();

function returnPath() {
  if (isTop) {
    return 0;
  }
  if (isOuter) {
    return 1;
  }
  if (isPants) {
    return 2;
  }
  if (isOnepiece) {
    return 3;
  }
  if (isSkirt) {
    return 4;
  }
  if (isBag) {
    return 5;
  }
  if (isSneakers) {
    return 6;
  }
  if (isShoes) {
    return 7;
  }
  if (isWatch) {
    return 8;
  }
  if (isHat) {
    return 10;
  }
  if (isSocks) {
    return 11;
  }
}
function returnCategory() {
  if (isMain) {
    return '전체상품';
  }
  if (isClothing) {
    return '의류';
  }
  if (isAcc) {
    return '악세사리';
  }
  if (isTop) {
    return '상의';
  }
  if (isOuter) {
    return '아우터';
  }
  if (isPants) {
    return '바지';
  }
  if (isOnepiece) {
    return '원피스';
  }
  if (isSkirt) {
    return '스커트';
  }
  if (isBag) {
    return '가방';
  }
  if (isSneakers) {
    return '스니커즈';
  }
  if (isShoes) {
    return '신발';
  }
  if (isWatch) {
    return '시계';
  }
  if (isHat) {
    return '모자';
  }
  if (isSocks) {
    return '양말';
  }
}

// 의류, 악세사리, 개별 카테고리 제품목록 조회
function clothingProductList() {
  for (let i = 0; i < productCategoryId.length; i++) {
    for (let n = 0; n <= 4; n++) {
      if (productCategoryId[i] === categoryId[n]) {
        clothingArr.push(productList[i]);
      }
    }
  }
}
function accProductList() {
  for (let i = 0; i < productCategoryId.length; i++) {
    for (let n = 5; n <= 11; n++) {
      if (productCategoryId[i] === categoryId[n]) {
        accArr.push(productList[i]);
      }
    }
  }
}
function individualProductList() {
  for (let i = 0; i < productCategoryId.length; i++) {
    if (productCategoryId[i] === categoryId[returnPath()]) {
      sameCategory.push(productList[i]);
    }
  }
}

// 상단 타이틀 이름, 상품 갯수 업데이트
function productTitle() {
  const titleArea = document.querySelector('.product-list-area-top');
  const title = `
  <h2 class="product-list-name">전체상품</h2>
  <p class="product-list-count">상품 1,234</p>
  `;

  titleArea.innerHTML = title;

  // 현재 위치에 따라 타이틀 이름 업데이트
  const productName = document.querySelector('.product-list-name');
  const categoryName = returnCategory();

  productName.innerHTML = `${categoryName}`;

  // 현재 위치에 따라 상품 갯수 업데이트
  const productCount = document.querySelector('.product-list-count');
  const countProduct = isMain
    ? productList.length
    : isClothing
    ? clothingArr.length
    : isAcc
    ? accArr.length
    : sameCategory.length;

  productCount.innerHTML = `상품 ${countProduct}`;
}
// 좌측 카테고리 네비게이션 렌더
function renderProductCategory() {
  const categoryArea = document.querySelector('.product-list-area-left');
  const category = `
  <div class="product-list-category">
  <p><a href="/product">카테고리</a></p>
  <ul>
    <a href="/product" ${isMain ? `class="focus"` : ''}>전체상품</a>
  </ul>
  <ul>
    <a href="/product/clothing" ${isClothing ? `class="focus"` : ''}>의류</a>
    <li><a href="/product/top" ${isTop ? `class="focus"` : ''}>상의</a></li>
    <li><a href="/product/outer" ${
      isOuter ? `class="focus"` : ''
    }>아우터</a></li>
    <li><a href="/product/pants" ${isPants ? `class="focus"` : ''}>바지</a></li>
    <li><a href="/product/onepiece" ${
      isOnepiece ? `class="focus"` : ''
    }>원피스</a></li>
    <li><a href="/product/skirt" ${
      isSkirt ? `class="focus"` : ''
    }>스커트</a></li>
  </ul>
  <ul>
    <a href="/product/accessories" ${isAcc ? `class="focus"` : ''}>악세사리</a>
    <li><a href="/product/bag" ${isBag ? `class="focus"` : ''}>가방</a></li>
    <li><a href="/product/sneakers" ${
      isSneakers ? `class="focus"` : ''
    }>스니커즈</a></li>
    <li><a href="/product/shoes" ${isShoes ? `class="focus"` : ''}>신발</a></li>
    <li><a href="/product/watch" ${isWatch ? `class="focus"` : ''}>시계</a></li>
    <li><a href="/product/hat" ${isHat ? `class="focus"` : ''}>모자</a></li>
    <li><a href="/product/socks" ${isSocks ? `class="focus"` : ''}>양말</a></li>
  </ul>
  </div>
  `;
  categoryArea.innerHTML = category;
}
// 전체 상품 리스트 렌더
function renderProductAll() {
  const productUl = document.querySelector('.product-list-ul');
  for (let i = 0; i < productList.length; i++) {
    const productImagePath = productList[i].imagePath;
    const productBrand = productList[i].brand;
    const productName = productList[i].name;
    const productContent = productList[i].content;
    const productPrice = addCommas(productList[i].price);

    const productTemplate = `
  <li class="product-list-box">
    <a href="/product/detail/">
      <img class="product-list-box-img" src="${productImagePath}" alt="의상" />
      <p class="product-list-box-brand">${productBrand}</p>
      <p class="product-list-box-name text-eliellipsis">${productName}</p>
      <p class="product-list-box-content text-eliellipsis">${productContent}</p>
      <p class="product-list-box-price">${productPrice}원</p>
    </a>
  </li>
`;
    productUl.insertAdjacentHTML('afterbegin', productTemplate);

    // 제품 클릭 시 상세 페이지로 이동
    const productListBox = document.querySelector('.product-list-box');
    productListBox.addEventListener('click', () => {
      sessionStorage.setItem('productId', productList[i]._id);
    });
  }
}
// 의류 상품 리스트 렌더
function renderProductClothing() {
  const productUl = document.querySelector('.product-list-ul');
  for (let i = 0; i < clothingArr.length; i++) {
    const productImagePath = clothingArr[i].imagePath;
    const productBrand = clothingArr[i].brand;
    const productName = clothingArr[i].name;
    const productContent = clothingArr[i].content;
    const productPrice = addCommas(clothingArr[i].price);

    const productTemplate = `
  <li class="product-list-box">
    <a href="/product/detail/">
      <img class="product-list-box-img" src="${productImagePath}" alt="의상" />
      <p class="product-list-box-brand">${productBrand}</p>
      <p class="product-list-box-name text-eliellipsis">${productName}</p>
      <p class="product-list-box-content text-eliellipsis">${productContent}</p>
      <p class="product-list-box-price">${productPrice}원</p>
    </a>
  </li>
`;
    productUl.insertAdjacentHTML('afterbegin', productTemplate);

    // 제품 클릭 시 상세 페이지로 이동
    const productListBox = document.querySelector('.product-list-box');
    productListBox.addEventListener('click', () => {
      sessionStorage.setItem('productId', clothingArr[i]._id);
    });
  }
}
// 악세사리 상품 리스트 렌더
function renderProductAccessories() {
  const productUl = document.querySelector('.product-list-ul');

  for (let i = 0; i < accArr.length; i++) {
    const productImagePath = accArr[i].imagePath;
    const productBrand = accArr[i].brand;
    const productName = accArr[i].name;
    const productContent = accArr[i].content;
    const productPrice = addCommas(accArr[i].price);

    const productTemplate = `
  <li class="product-list-box">
    <a href="/product/detail/">
      <img class="product-list-box-img" src="${productImagePath}" alt="의상" />
      <p class="product-list-box-brand">${productBrand}</p>
      <p class="product-list-box-name text-eliellipsis">${productName}</p>
      <p class="product-list-box-content text-eliellipsis">${productContent}</p>
      <p class="product-list-box-price">${productPrice}원</p>
    </a>
  </li>
`;
    productUl.insertAdjacentHTML('afterbegin', productTemplate);

    // 제품 클릭 시 상세 페이지로 이동
    const productListBox = document.querySelector('.product-list-box');
    productListBox.addEventListener('click', () => {
      sessionStorage.setItem('productId', accArr[i]._id);
    });
  }
}
// 개별 상품 리스트 렌더
function renderProductIndividual() {
  const productUl = document.querySelector('.product-list-ul');
  let productImagePath = '';
  let productBrand = '';
  let productName = '';
  let productContent = '';
  let productPrice = '';

  for (let i = 0; i < sameCategory.length; i++) {
    productImagePath = sameCategory[i].imagePath;
    productBrand = sameCategory[i].brand;
    productName = sameCategory[i].name;
    productContent = sameCategory[i].content;
    productPrice = addCommas(sameCategory[i].price);

    const productTemplate = `
  <li class="product-list-box">
    <a href="/product/detail/">
      <img class="product-list-box-img" src="${productImagePath}" alt="의상" />
      <p class="product-list-box-brand">${productBrand}</p>
      <p class="product-list-box-name text-eliellipsis">${productName}</p>
      <p class="product-list-box-content text-eliellipsis">${productContent}</p>
      <p class="product-list-box-price">${productPrice}원</p>
    </a>
  </li>
`;
    productUl.insertAdjacentHTML('afterbegin', productTemplate);

    // 제품 클릭 시 상세 페이지로 이동
    const productListBox = document.querySelector('.product-list-box');
    productListBox.addEventListener('click', () => {
      sessionStorage.setItem('productId', sameCategory[i]._id);
    });
  }
}
// 조건에 맞는 제품 리스트 렌더
function renderproductItemList() {
  const productUl = document.querySelector('.product-list-ul');

  // 등록된 상품이 존재하지 않을 경우
  if (
    sameCategory.length === 0 ||
    clothingArr.length === 0 ||
    accArr.length === 0
  ) {
    productUl.innerHTML = `
    <div class="product-list-none display-center">
      <p>현재 등록된 상품이 없습니다.</p>
    </div>
    `;

    if (isMain || isClothing || isAcc) {
      productUl.innerHTML = `
      <div style="display:none" class="product-list-none display-center">
      <p>현재 등록된 상품이 없습니다.</p>
    </div>
    `;
    }
  }

  // 전체상품 리스트 호출
  if (isMain) {
    renderProductAll();
  }
  // 의류상품 리스트 호출
  if (isClothing) {
    renderProductClothing();
  }
  // 악세사리상품 리스트 호출
  if (isAcc) {
    renderProductAccessories();
  }
  // 개별상품 리스트 호출
  if (
    isTop ||
    isOuter ||
    isPants ||
    isOnepiece ||
    isSkirt ||
    isBag ||
    isSneakers ||
    isShoes ||
    isWatch ||
    isHat ||
    isSocks
  ) {
    renderProductIndividual();
  }
}
// 완성된 카테고리, 제품 리스트 렌더
function renderAllProduct() {
  renderProductCategory(), renderproductItemList();
}

export { productTitle, renderAllProduct };
