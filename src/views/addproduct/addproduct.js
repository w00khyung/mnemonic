import * as Api from '/api.js';
import { navRender } from '../components/header.js';

const productName1 = document.getElementById('productName');
const price1 = document.getElementById('price');
const barnd1 = document.getElementById('brand');
const select1 = document.getElementById('selectbox');
const contents1 = document.getElementById('summernote');
const img1 = document.getElementById('imgId');
const submitButton = document.getElementById('submit');

navRender();
start();
addAllEvents();
async function start() {
  const user = await Api.get('/api/my');
  document.getElementById('name').value = user.fullName;

  const getCategory = await Api.get('/api/category/categorylist');
  const min = 0;
  const max = getCategory.length;

  for (let i = min; i < max; i++) {
    const opt = document.createElement('option');
    opt.value = getCategory[i]._id;
    opt.innerHTML = getCategory[i].name;
    select1.appendChild(opt);
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  // 상품 추가 요청
  try {
    const name = productName1.value;
    const price = price1.value;
    const brand = barnd1.value;
    const content = contents1.value;
    const imagePath = img1.src;
    const category = select1.value;
    const data = { name, price, brand, content, imagePath, category };

    const result = await Api.post('/api/product/register', data);
    const { token } = result;

    sessionStorage.setItem('token', token);

    // 기본 페이지로 이동
    window.location.href = '/';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}
