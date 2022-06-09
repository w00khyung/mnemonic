import * as Api from '/api.js';
import { addCommas } from '/useful-functions.js';
import { navRender } from '../../components/header.js';
import { pageScroll } from '../../components/pagescroll.js';
import { mypageNavigation } from '../../components/mypage.js';

const saleBody = document.querySelector('body');
const saleLists = document.querySelector('.mypage-sale-lists');
const saleModal = document.querySelector('.mypage-sale-modal');
const productName = document.querySelector('#product-name');
const productPrice = document.querySelector('#product-price');
const productBrand = document.querySelector('#product-brand');
const categotySelect = document.querySelector('#product-category-select');
const productContent = document.querySelector('#product-note');
const imgId = document.querySelector('#imgId');
const submitButton = document.querySelector('#submit');

navRender();
pageScroll();
mypageNavigation();
categoryList();

const userList = await Api.get(`/api/userlist`);
const productList = await Api.get(`/api/product/productlist`);

const userEmail = userList.map((list) => list.email);
const sessionUserEmail = sessionStorage.getItem('email');
let currentUser = '';
// let userSaleListId = [];

for (let i = 0; i < userEmail.length; i++) {
  if (userEmail[i] === sessionUserEmail) {
    currentUser = userEmail[i];
  }
}

for (let i = 0; i < productList.length; i++) {
  if (productList[i].sellerId.email === currentUser) {
    const userSaleListId = productList[i]._id;
    const userSaleListImg = productList[i].imagePath;
    const userSaleListBrand = productList[i].brand;
    const userSaleListName = productList[i].name;
    const userSaleListContent = productList[i].content;
    const userSaleListPrice = productList[i].price;

    const userSaleListTemp = `<ul class="mypage-sale-list">
    <li class="mypage-sale-list-img"><img src="${userSaleListImg}" alt=""></li>
    <div class="mypage-sale-list-text">
      <li class="mypage-sale-list-brand">${userSaleListBrand}</li>
      <li class="mypage-sale-list-name text-eliellipsis">${userSaleListName}</li>
      <li class="mypage-sale-list-content text-eliellipsis">${userSaleListContent}</li>
    </div>
    <li class="mypage-sale-list-price display-center">
      <p class="mypage-sale-list-price-text">${addCommas(userSaleListPrice)}</p>
    </li>
    <div class="mypage-sale-btns display-center">
      <button id="${userSaleListId}" class="button is-light mypage-sale-btn-edit">수정</button>
      <button id="${userSaleListId}" class="button is-black mypage-sale-btn-remove">삭제</button>
    </div>
  </ul>`;

    saleLists.insertAdjacentHTML('beforeend', userSaleListTemp);
  }
}

const saleListsBtnEdit = document.querySelectorAll('.mypage-sale-btn-edit');
const saleListsBtnRemove = document.querySelectorAll('.mypage-sale-btn-remove');

function handleEdit(e) {
  const closeBtn = document.querySelector('.fa-xmark');
  const productId = e.target.id;

  sessionStorage.setItem('currentId', productId);
  saleBody.style.overflow = 'hidden';
  saleModal.style.display = 'flex';

  closeBtn.addEventListener('click', () => {
    saleBody.style.overflow = 'visible';
    saleModal.style.display = 'none';
  });

  productList.map((list) => {
    if (list._id === productId) {
      const currentImg = list.imagePath;
      const currentName = list.name;
      const currentBrand = list.brand;
      const currentContent = list.content;
      const currnetPrice = list.price;

      imgId.src = currentImg;
      productName.value = currentName;
      productBrand.value = currentBrand;
      productContent.innerHTML = currentContent;
      productPrice.value = currnetPrice;
    }
  });
}

async function handleDelete(e) {
  e.preventDefault();
  const productId = e.target.id;
  const confirm = window.confirm('정말 삭제하시겠습니까?');
  if (!confirm) return;

  // 제품 삭제 api 요청
  try {
    await Api.delete(`/api/product/delete/${productId}`);
    alert('정상적으로 삭제되었습니다.');

    window.location.reload();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function categoryList() {
  const user = await Api.get('/api/my');
  document.querySelector('#user-name').value = user.fullName;

  const categoryList = await Api.get('/api/category/categorylist');
  const categoryCode = categoryList.map((el) => el.code);
  const min = 0;
  const max = categoryList.length;

  // 카테고리 code 순으로 정렬
  const categoryCodeSort = categoryCode.sort((a, b) => {
    if (a > b) return 1;
    if (a === b) return 0;
    if (a < b) return -1;
  });

  let sortedCategoryName = [];
  let sortedCategoryId = [];

  // category code순서대로 카테고리 이름 정렬
  for (let i = min; i < max; i++) {
    for (let n = min; n < max; n++) {
      if (categoryList[n].code === categoryCodeSort[i]) {
        sortedCategoryName.push(categoryList[n].name);
        sortedCategoryId.push(categoryList[n]._id);
      }
    }
  }

  for (let i = min; i < max; i++) {
    const opt = document.createElement('option');
    opt.value = sortedCategoryId[i];
    opt.innerHTML = sortedCategoryName[i];
    categotySelect.appendChild(opt);
  }
}

async function imageUp(e) {
  const formData = new FormData();
  const photos = document.querySelector('input[type="file"]');
  formData.append(`photo`, photos.files[0]);

  for (var pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
  await fetch('/api/upload/imageUpload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      document.querySelector('#imgId').src = result['imageUrl'];
      console.log('성공:', result);
    })
    .catch((error) => {
      console.error('실패:', error);
    });
}
const inputGroupFile01 = document.querySelector('#inputGroupFile01');

inputGroupFile01.addEventListener('change', imageUp);

async function handleSubmit(e) {
  e.preventDefault();
  const productId = sessionStorage.getItem('currentId');

  // 상품 수정 요청
  try {
    const name = productName.value;
    const price = productPrice.value;
    const brand = productBrand.value;
    const content = productContent.value;
    const imagePath = imgId.src;
    const category = categotySelect.value;

    const data = { name, price, brand, content, imagePath, category };

    await Api.patch(`/api/product/products/user`, productId, data);
    alert('성공적으로 수정을 완료했습니다.');
    window.location.reload();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

for (let i = 0; i < saleListsBtnRemove.length; i++) {
  saleListsBtnRemove[i].addEventListener('click', handleDelete);
}

for (let i = 0; i < saleListsBtnEdit.length; i++) {
  saleListsBtnEdit[i].addEventListener('click', handleEdit);
}

submitButton.addEventListener('click', handleSubmit);
