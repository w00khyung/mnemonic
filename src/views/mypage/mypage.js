import * as Api from '/api.js';
import { addCommas, addHyphen, getCookie } from '/useful-functions.js';
import { navRender } from '../components/header.js';
import { pageScroll } from '../components/pagescroll.js';
import { mypageNavigation } from '../components/mypage.js';

const proFileName = document.querySelector('.mypage-user-profile-name');
const proFileEmail = document.querySelector('.mypage-user-profile-email');
const proFilePhone = document.querySelector('.mypage-user-profile-phone');
const proFileRole = document.querySelector('.mypage-user-profile-role');

const mypageIcon = document.querySelector('.mypageIcon');
const orderContainer = document.querySelector('.mypage-order');
const saleContainer = document.querySelector('.mypage-sale');

const userList = await Api.get(`/api/userlist`, '', true);
const productList = await Api.get(`/api/product/productlist`);
const email = getCookie('email');
const userEmail = userList.map((list) => list.email);
let currentUser = '';


navRender();
pageScroll();
mypageNavigation();
userInfo();
orderHistory();
userSaleList();
userSaleListNone();

// 변경된 아이콘 출력
if (sessionStorage.getItem('icon')) {
  mypageIcon.src = sessionStorage.getItem('icon');
}

// 유저 정보 출력
async function userInfo() {
  userList.map((list) => {
    if (list.email === email) {
      const userName = list.fullName;
      const userEmail = list.email;
      const userPhone = list.phoneNumber;
      const userRole = list.role;

      proFileName.innerHTML = userName;
      proFileEmail.innerHTML = userEmail;
      proFilePhone.innerHTML = addHyphen(`0${userPhone}`);
      proFileRole.innerHTML = userRole === 'basic-user' ? '일반회원' : '관리자';
    }
  });
}

// get으로 데이터를 가져온 후 필요한 정보를 출력
async function orderHistory() {
  // 주문이 완료된 현재 날짜를 가져옴
  const todayResult = todayDate();
  const ordersList = await Api.get('/api/orders', '', true);
  console.log(ordersList);
  const { data } = ordersList;
  // get으로 가져온 데이터에 products(상품명,수량)를 담음
  const purchaseInfo = data.map((item) => item.purchaseOrderInfo.products[0]);

  // 주문된 상품 리스트를 만들어줌
  for (let i = 0; i < data.length; i += 1) {
    orderContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="columns orders-item" >
          <div class="text-eliellipsis order-item-number">${todayResult}<br>[${data[i]._id}]</div>
          <div class="text-eliellipsis order-item-info">${purchaseInfo[i]}<br></div>
          <div class="text-eliellipsis order-item-state">상품 준비중</div>
        </div> `
    );
  }
}

// 주문 완료됐을 때 배송 조회에 오늘 날짜 출력
function todayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `0${today.getMonth() + 1}`.slice(-2);
  const date = `0${today.getDate()}`.slice(-2);
  const result = `${year}-${month}-${date}`;
  return result;
}

// 유저 판매 목록
async function userSaleList() {
  for (let i = 0; i < userEmail.length; i++) {
    if (userEmail[i] === email) {
      currentUser = userEmail[i];
    }
  }

  for (let i = 0; i < productList.length; i++) {
    if (productList[i].sellerId.email === currentUser) {
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
        <p class="mypage-sale-list-price-text">${addCommas(
          userSaleListPrice
        )}</p>
      </li>
    </ul>`;

      saleContainer.insertAdjacentHTML('beforeend', userSaleListTemp);
    }
  }
}

// 유저 판매 목록이 없을 경우
async function userSaleListNone() {
  const listCount = document.querySelectorAll('.mypage-sale-list');

  if (listCount.length === 0) {
    saleContainer.innerHTML = `<div class="mypage-sale-list-none display-center">
    <p>판매내역이 없습니다.</p>
    </div>
    `;

  }
}
