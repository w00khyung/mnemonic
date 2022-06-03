// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

import * as Api from '/api.js';
import { randomId } from '/useful-functions.js';
import { navRender } from '../components/header.js';

// 요소(element), input 혹은 상수
const backtoTop = document.getElementById('backtotop');
navRender();

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  getProductsAndCategory();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  backtoTop.addEventListener('click', moveBacktoTop);
  window.addEventListener('scroll', checkScroll);
}

async function getProductsAndCategory() {
  const setCategoryProducts = document.querySelector('.setCategoryProducts');

  const category = await Api.get('/api/category/categorylist');

  const getProducts = await Promise.all(
    category.map(async (category) => {
      const result = await Api.get(
        '/api/product/category',
        `${category._id}/0/5`
      );
      return result;
    })
  );
  let insertProductsOfCategory = '';
  try {
    for (let i = 0; i < getProducts.length; i += 1) {
      const len = getProducts[i].length;
      if (len === 0) {
        continue;
      }

      const products = getProducts[i];
      // 제폼 목록 페이지 구현하기 a herf="#"에 추가하기
      console.log(products);
      insertProductsOfCategory += `
  <section>
      <div class="inner">
    <div class="category-brand-sellers-container">
    <div class="category-container">
      <div class="category">${products[0].category.name}</div>
        <div class="class-contain">
        <div class="class-append"><a href="#"> ${
          len > 4 ? '더보기' : ''
        }</a></div>
      </div>
    </div>
    <ul class="class-list" data-position="0">
    `;
      // 제품 상세보기 페이지 구현하고 a herf=""에 추가하기

      for (let j = 0; j < len; j += 1) {
        insertProductsOfCategory += `
      <li class="class-card">
        <a href="">
          <img src="${products[j].imagePath}" alt="" class="class-image" />
        </a>
        <div class="class-container">
          <div class="class-brand-seller">
            <div class="class-brand">${products[j].brand}</div>
            <div class="class-seller">${products[j].sellerId.fullName}</div>
          </div>
          <div class="class-productName-price">
            <div class="class-productName">
             ${products[j].name}
            </div>
            <div class="class-price">${Number(
              products[j].price
            ).toLocaleString()}원</div>
          </div>
        </div>
      </li>

      `;
      }
      insertProductsOfCategory += `
      </ul>
    </div>
    </div>
    </section>
    `;
    }
  } catch (err) {
    console.log(err);
  }
  setCategoryProducts.innerHTML = insertProductsOfCategory;
}

function alertLandingText() {
  alert('n팀 쇼핑몰입니다. 안녕하세요.');
}

function alertGreetingText() {
  alert('n팀 쇼핑몰에 오신 것을 환영합니다');
}
function moveBacktoTop() {
  /* smooth하게 스크롤 하기
     https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo */
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
function checkScroll() {
  /* 웹페이지가 수직으로 얼마나 스크롤되었는지를 확인하는 값(픽셀 단위로 반환)
    https://developer.mozilla.org/ko/docs/Web/API/Window/pageYOffset  */

  const { pageYOffset } = window;
  if (pageYOffset !== 0) {
    backtotop.classList.add('show');
  } else {
    backtotop.classList.remove('show');
  }
}
async function getDataFromApi() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
  const data = await Api.get('/api/user/data');
  const random = randomId();

  console.log({ data });
  console.log({ random });
}
