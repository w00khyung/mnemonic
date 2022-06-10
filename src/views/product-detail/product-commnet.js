import * as Api from '/api.js';

// 요소(element), input 혹은 상수
const productImagePath = '';
const productBrand = '';
const productName = '';
const productContent = '';
const productPrice = '';

addAllElements();
addAllEvents();

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  backtoTop.addEventListener('click', moveBacktoTop);
  window.addEventListener('scroll', checkScroll);
  setCategoryProducts.addEventListener('click', goToProductDetail);
  getArrowLeft.addEventListener('click', previousSlide);
  getArrowRight.addEventListener('click', nextSlide);
  radioController();
}

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  await renderCommentDetail();
}

async function renderCommentDetail() {
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
    <button class="button is-black">바로 구매하기</button>
  </div>
</div>
</section>
`;

  wrap.innerHTML = productDetailTemplate;
}
