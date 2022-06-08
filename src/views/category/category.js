import { adminnavRender } from '../components/admin-header.js';
import * as Api from '../api.js';

// 메뉴에 있는 카테고리 추가,생성,관리 버튼
const addCategoryBtn = document.querySelector('.handleAddCategory');
const handleChangeCategory = document.querySelector('.handleChangeCategory');
const handleDeleteCategory = document.querySelector('.handleDeleteCategory');

// 카테고리 생성하는 입력
const createCategoryBtn = document.querySelector('#createCategory');
const receiverName = document.querySelector('#receiverName');
const receiverCode = document.querySelector('#receiverCode');

// 카테고리 삭제하는 입력
const deleteCategoryBtn = document.querySelector('#deleteCategory');
const deleteCode = document.querySelector('#deleteCode');
// 카테고리 수정

if (sessionStorage.getItem('email') === 'manager@gmail.com') {
  adminnavRender();
  handleProductCategory();
} else {
  alert('관리자만 접근이 가능합니다.');
  window.location.href = '/login';
}

async function handleProductCategory() {
  const productCategory = document.querySelector('.productCategory');
  const categoryList = await Api.get(`/api/category/categorylist`);
  console.log(categoryList);
  categoryList.forEach((item) => {
    productCategory.insertAdjacentHTML(
      'beforeend',
      `<div class="columns orders-item" id="${item.code}">
          <div class="basic_item"><span class="txt_name">${item.name}</span></div>
          <input type="text" class="tf_blog" maxlength="10" >
          <button class="changeCategoryBtn">수정</button>
       </div> `
    );
  });
}

async function addCategoryList() {
  // if (!receiverName || !receiverCode) {
  //   alert('입력해주세요');
  // }
  createCategoryBtn.style.display = 'block';
  receiverName.style.display = 'block';
  receiverCode.style.display = 'block';

  createCategoryBtn.addEventListener('click', async () => {
    const newCategoryName = receiverName.value;
    const newCategoryCode = receiverCode.value;
    const data = {
      name: newCategoryName,
      code: newCategoryCode,
    };

    try {
      await Api.post('/api/category/register/', data);
      alert('카테고리가 생성되었습니다');
      window.location.reload();
    } catch (err) {
      alert('오류 발생' + err);
    }
  });
}

async function deleteCategoryList() {
  deleteCode.style.display = 'block';
  deleteCategoryBtn.style.display = 'block';

  deleteCategoryBtn.addEventListener('click', async () => {
    const deleteCategoryCode = deleteCode.value;
    if (window.confirm('카테고리를 삭제하시겠습니까?')) {
      await Api.delete(`/api/category/${deleteCategoryCode}`);
      window.location.reload();
    } else {
      return;
    }
  });
}

function changeCategoryList() {
  const changeCategoryBtn = document.querySelectorAll('.changeCategoryBtn');
  changeCategoryBtn.forEach((item) => {
    item.style.display = 'block';
    item.addEventListener('click', (event) => {
      console.log(event.target.firstChild);
      const resultDiv = event.target.nextSibling;
      resultDiv.innerHTML =
        "<input type='text' class='tf_blog' maxlength='10' ></input>";
      //<input type="text" class="tf_blog" maxlength="10" >;
      console.log(event.target.nextSibling);
    });
  });
}

addCategoryBtn.addEventListener('click', addCategoryList);
handleChangeCategory?.addEventListener('click', changeCategoryList);
handleDeleteCategory.addEventListener('click', deleteCategoryList);
