import { adminnavRender } from '../components/admin-header.js';
import * as Api from '../api.js';

// 메뉴에 있는 카테고리 추가,생성,관리
const addCategoryBtn = document.querySelector('.handleAddCategory');
const handledeleteCategory = document.querySelector('.handledeleteCategory');
// 카테고리 생성하는 입력
const createCategoryBtn = document.querySelector('#createCategory');
const receiverName = document.querySelector('#receiverName');
const receiverCode = document.querySelector('#receiverCode');

// 카테고리 삭제하는 입력
const deleteCategoryBtn = document.querySelector('#deleteCategory');
const deleteCode = document.querySelector('#deleteCode');
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
          <div class="">${item.name}</div>
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
function deleteCategoryList() {
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
addCategoryBtn.addEventListener('click', addCategoryList);
handledeleteCategory.addEventListener('click', deleteCategoryList);

// async function orderHistory() {
//   const ordersList = await Api.get('/api/orders/admin');
//   // get으로 가져온 데이터에 products(상품명,수량)를 담음
//   const purchaseInfo = ordersList.map((item) => {
//     const orderNumber = item._id;
//     const orderItemName = item.purchaseOrderInfo.products[0];
//     const orderUserID = item.orderer.email;
//     const orderUserName = item.orderer.fullName;
//     const orderDate = item.updatedAt;

//     // 주문된 상품 리스트를 만들어줌
//     ordersContainer.insertAdjacentHTML(
//       'beforeend',
//       `<div class="columns orders-item" >
//         <div class="column is-2">
//         ${orderDate.slice(0, 10)}<br>
//         ${orderDate.slice(11, 19)}</div>
//         <div class="column is-2">${orderUserID}<br>${orderUserName}</div>
//         <div class="column is-4">${orderItemName}<br></div>
//         <div class="column is-2">상품 준비중</div>
//         <div class="column is-2"><button class="orderCancel" id="${orderNumber}">주문 취소</button></div>
//         </div> `
//     );
//   });
