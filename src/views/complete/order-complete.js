import { navRender } from '/components/header.js';
navRender();

const orderDetailButton = document.querySelector('#orderDetailButton');
const shoppingButton = document.querySelector('#shoppingButton');

function shoppingLink() {
  window.location.href = '/';
}
function orderDetailLink() {
  window.location.href = '/mypage/orders';
}
// 주문내역 버튼 클릭 시 주문 배송 조회
orderDetailButton.addEventListener('click', orderDetailLink);
// 쇼핑 계속하기 버튼 클릭 시 홈으로 이동
shoppingButton.addEventListener('click', shoppingLink);
