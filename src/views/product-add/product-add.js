import * as Api from '/api.js';
import { navRender } from '../../components/header.js';

const productName = document.querySelector('#product-name');
const productPrice = document.querySelector('#product-price');
const productBrand = document.querySelector('#product-brand');
const categotySelect = document.querySelector('#product-category-select');
const productContent = document.querySelector('#product-note');
const imgId = document.querySelector('#imgId');
const submitButton = document.querySelector('#submit');

navRender();
start();
addAllEvents();

async function start() {
  const user = await Api.get('/api/my');
  document.querySelector('#user-name').value = user.fullName;

  const categoryList = await Api.get('/api/category/categorylist');
  const categoryCode = categoryList.map((el) => el.code);
  const min = 0;
  const max = categoryList.length;

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

  // 상품 추가 요청
  try {
    const name = productName.value;
    const price = productPrice.value;
    const brand = productBrand.value;
    const content = productContent.value;
    const imagePath = imgId.src;
    const category = categotySelect.value;
    const data = { name, price, brand, content, imagePath, category };

    await Api.post('/api/product/register', data);

    // 기본 페이지로 이동
    window.location.reload();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}
