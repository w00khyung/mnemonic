import * as Api from '/api.js';
import { addCommas } from '/useful-functions.js';
import { navRender } from '../components/header.js';

const productListUl = document.querySelector('.product-list-ul');
const titleArea = document.querySelector('.product-list-area-top');

const productList = await Api.get(`/api/product/productlist`);
const categoryList = await Api.get(`/api/category/categorylist`);
const categoryName = categoryList.map((el) => el.name);
const categoryCode = categoryList.map((el) => el.code);

// 의류 100 - 599
let productClothList = [];
// 악세사리 600 - 1299
let productAccList = [];
// 이너웨어 1300 - ?
let productInnerList = [];

// 카테고리 code 순으로 정렬
const categoryCodeSort = categoryCode.sort((a, b) => {
  if (a > b) return 1;
  if (a === b) return 0;
  if (a < b) return -1;
});
let sortedCategoryName = [];
let sortedCategoryId = [];

navRender();
sortedCategories();
mainCategoryProductList();
renderProductMainPage();
renderProductCategory();
currentTargetCategoryClick();

// category code순서대로 카테고리 이름 정렬
function sortedCategories() {
  for (let i = 0; i < categoryList.length; i++) {
    for (let n = 0; n < categoryList.length; n++) {
      if (categoryList[n].code === categoryCodeSort[i]) {
        sortedCategoryName.push(categoryList[n].name);
        sortedCategoryId.push(categoryList[n]._id);
      }
    }
  }
}

// 코드범위에 따른 메인 카테고리 분류 (의류, 악세사리, 이너웨어)
function mainCategoryProductList() {
  productList.map((list) => {
    if (list.category.code >= 100 && list.category.code <= 599) {
      productClothList.push(list);
    } else if (list.category.code >= 600 && list.category.code <= 1299) {
      productAccList.push(list);
    } else if (list.category.code >= 1300) {
      productInnerList.push(list);
    }
  });
}

// product li 템플릿
function productTemp(
  i,
  targetProductImagePath,
  targetProductBrand,
  targetProductName,
  targetProductContent,
  targetProductPrice
) {
  const productTemplate = `
      <li class="product-list-box">
        <a href="/product/detail/">
          <div class="product-list-box-img">
           <img src="${targetProductImagePath}" alt="의상" />
           <div class="product-list-box-img-btn display-center">
            <button class="product-list-box-img-btn-order">ADD CART</button>
           </div>
          </div>
          <p class="product-list-box-brand">${targetProductBrand}</p>
          <p class="product-list-box-name text-eliellipsis">${targetProductName}</p>
          <p class="product-list-box-content text-eliellipsis">${targetProductContent}</p>
          <p class="product-list-box-price">${targetProductPrice}원</p>
        </a>
      </li>
    `;
  productListUl.insertAdjacentHTML('afterbegin', productTemplate);

  const productListBox = document.querySelector('.product-list-box');
  const productImgBtn = document.querySelector('.product-list-box-img-btn');
  const productImgOrderBtn = document.querySelector(
    '.product-list-box-img-btn-order'
  );

  // 제품 클릭 시 상세 페이지로 이동
  productListBox.addEventListener('click', () => {
    sessionStorage.setItem('productId', productList[i]._id);
  });

  // 바로 주문하기 버튼 나타냄
  productListBox.addEventListener('mouseenter', () => {
    productImgBtn.classList.add('go-top');
  });
  productListBox.addEventListener('mouseleave', () => {
    productImgBtn.classList.remove('go-top');
  });
  productImgOrderBtn.addEventListener('mouseenter', () => {
    productImgOrderBtn.innerHTML =
      '<i class="fa-solid fa-arrow-right-long"></i>';
  });
  productImgOrderBtn.addEventListener('mouseleave', () => {
    productImgOrderBtn.innerHTML = 'ADD CART';
  });
}

// 전체상품 리스트 렌더
function renderProductMainPage() {
  const productTitle = `
  <h2 class="product-list-name">전체상품</h2>
  <p class="product-list-count">상품 ${productList.length}</p>
  `;
  titleArea.innerHTML = productTitle;

  for (let i = 0; i < productList.length; i++) {
    const targetProduct = productList[i];
    const targetProductImagePath = targetProduct.imagePath;
    const targetProductBrand = targetProduct.brand;
    const targetProductName = targetProduct.name;
    const targetProductContent = targetProduct.content;
    const targetProductPrice = addCommas(targetProduct.price);

    productTemp(
      i,
      targetProductImagePath,
      targetProductBrand,
      targetProductName,
      targetProductContent,
      targetProductPrice
    );
  }
}

// 상단 타이틀, 상품 수 렌더
function renderProductTitle(e, currentTargetLength) {
  const titleArea = document.querySelector('.product-list-area-top');
  const productTitle = `
      <h2 class="product-list-name">${e.target.text}</h2>
      <p class="product-list-count">상품 ${
        e.target.text === '의류'
          ? productClothList.length
          : e.target.text === '악세사리'
          ? productAccList.length
          : e.target.text === '이너웨어'
          ? productInnerList.length
          : currentTargetLength.length
      }</p>
      `;
  titleArea.innerHTML = productTitle;
}

// 좌측 카테고리 네비게이션 렌더
function renderProductCategory() {
  const categoryArea = document.querySelector('.product-list-area-left');
  const category = `
  <div class="product-list-category">
  <p><a href="/product" class="focusss">카테고리</a></p>
  <ul class="product-list-category-all">
    <a href="/product" class="focusss">전체상품</a>
  </ul>
  <ul class="product-list-category-clothing">
    <a href="/product" class="focusss category-menu-name">의류</a>
  </ul>
  <ul class="product-list-category-accessories">
    <a href="/product" class="focusss category-menu-name">악세사리</a>
  </ul>
  <ul class="product-list-category-inner">
    <a href="/product" class="focusss category-menu-name">이너웨어</a>
  </ul>
  </div>
  `;
  categoryArea.innerHTML = category;

  const categoryUlCloth = document.querySelector(
    '.product-list-category-clothing'
  );
  const categoryUlAcc = document.querySelector(
    '.product-list-category-accessories'
  );
  const categoryUlInner = document.querySelector(
    '.product-list-category-inner'
  );

  for (let i = 0; i < categoryName.length; i++) {
    if (categoryCodeSort[i] >= 100 && categoryCodeSort[i] <= 599) {
      categoryUlCloth.insertAdjacentHTML(
        'beforeend',
        `<li><a href="/product/" id="${sortedCategoryId[i]}" class="focusss category-menu-name">${sortedCategoryName[i]}</a></li>`
      );
    } else if (categoryCodeSort[i] >= 600 && categoryCodeSort[i] <= 1299) {
      categoryUlAcc.insertAdjacentHTML(
        'beforeend',
        `<li><a href="/product/" id="${sortedCategoryId[i]}" class="focusss category-menu-name">${sortedCategoryName[i]}</a></li>`
      );
    } else {
      categoryUlInner.insertAdjacentHTML(
        'beforeend',
        `<li><a href="/product/" id="${sortedCategoryId[i]}" class="focusss category-menu-name">${sortedCategoryName[i]}</a></li>`
      );
    }
  }
}

// 카테고리에 맞는 상품 리스트 렌더
function renderProductListTemplate(e) {
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].category._id === e.target.id) {
      const targetProduct = productList[i];
      const targetProductImagePath = targetProduct.imagePath;
      const targetProductBrand = targetProduct.brand;
      const targetProductName = targetProduct.name;
      const targetProductContent = targetProduct.content;
      const targetProductPrice = addCommas(targetProduct.price);

      productTemp(
        i,
        targetProductImagePath,
        targetProductBrand,
        targetProductName,
        targetProductContent,
        targetProductPrice
      );
    }
  }
}

// 우측 제품목록 메인 카테고리 렌더
function renderProductListMain(e) {
  if (e.target.text === '의류') {
    for (let i = 0; i < productClothList.length; i++) {
      const targetProduct = productClothList[i];
      const targetProductImagePath = targetProduct.imagePath;
      const targetProductBrand = targetProduct.brand;
      const targetProductName = targetProduct.name;
      const targetProductContent = targetProduct.content;
      const targetProductPrice = addCommas(targetProduct.price);

      productTemp(
        i,
        targetProductImagePath,
        targetProductBrand,
        targetProductName,
        targetProductContent,
        targetProductPrice
      );
    }
  } else if (e.target.text === '악세사리') {
    for (let i = 0; i < productAccList.length; i++) {
      const targetProduct = productAccList[i];
      const targetProductImagePath = targetProduct.imagePath;
      const targetProductBrand = targetProduct.brand;
      const targetProductName = targetProduct.name;
      const targetProductContent = targetProduct.content;
      const targetProductPrice = addCommas(targetProduct.price);

      productTemp(
        i,
        targetProductImagePath,
        targetProductBrand,
        targetProductName,
        targetProductContent,
        targetProductPrice
      );
    }
  } else if (e.target.text === '이너웨어') {
    for (let i = 0; i < productInnerList.length; i++) {
      const targetProduct = productInnerList[i];
      const targetProductImagePath = targetProduct.imagePath;
      const targetProductBrand = targetProduct.brand;
      const targetProductName = targetProduct.name;
      const targetProductContent = targetProduct.content;
      const targetProductPrice = addCommas(targetProduct.price);

      productTemp(
        i,
        targetProductImagePath,
        targetProductBrand,
        targetProductName,
        targetProductContent,
        targetProductPrice
      );
    }
  }
}

// 우측 제품목록 렌더
function renderProductList(e) {
  e.preventDefault();
  productListUl.innerHTML = '';

  let currentTargetLength = [];

  if (e.target.text === '의류') {
    currentTargetLength = productClothList;
  } else if (e.target.text === '악세사리') {
    currentTargetLength = productAccList;
  } else if (e.target.text === '이너웨어') {
    currentTargetLength = productInnerList;
  }

  // target의 length가 0일 경우
  productList.map((list) => {
    if (list.category._id === e.target.id) {
      currentTargetLength.push(list);
    }
  });
  if (currentTargetLength.length === 0) {
    productListUl.innerHTML = `<div class="product-list-none display-center">
  <p>현재 등록된 상품이 없습니다.</p>
</div>`;
  }

  renderProductTitle(e, currentTargetLength);
  renderProductListTemplate(e);
  renderProductListMain(e);
}

function currentTargetCategoryClick() {
  const categoryMenuName = document.querySelectorAll('.category-menu-name');

  for (let i = 0; i < categoryMenuName.length; i++) {
    categoryMenuName[i].addEventListener('click', renderProductList);
  }
}
