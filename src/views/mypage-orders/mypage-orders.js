import * as Api from '/api.js';
import { navRender } from '/components/header.js';

navRender();

const ordersContainer = document.querySelector('#ordersContainer');

// get으로 데이터를 가져온 후 필요한 정보를 출력
async function orderHistory() {
  // 주문이 완료된 현재 날짜를 가져옴
  let todayResult = todayDate();
  const ordersList = await Api.get('/api/orders');
  const data = ordersList.data;
  // get으로 가져온 데이터에 products(상품명,수량)를 담음
  const purchaseInfo = data.map((item) => {
    return item.purchaseOrderInfo.products[0];
  });

  // 주문된 상품 리스트를 만들어줌
  for (let i = 0; i < data.length; i += 1) {
    ordersContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="columns orders-item" >
          <div class="column is-2">${todayResult}</div>
          <div class="column is-6">${purchaseInfo[i]}<br></div>
          <div class="column is-2">상품 준비중</div>
          <div class="column is-2"><button class="orderCancel" id="${data[i]._id}">주문 취소</button></div>
        </div> `
    );
  }

  // 취소 버튼이 클릭되면 주문을 취소
  const orderCancelBtn = document.querySelectorAll('.orderCancel');
  for (const btn of orderCancelBtn) {
    btn.addEventListener('click', async function (event) {
      const orderId = event.target.id;
      if (window.confirm('삭제하시겠습니까?')) {
        await Api.patch(`/api/orders/${orderId}`);
        location.reload();
      } else {
        return;
      }
    });
  }
}

// 주문 완료됐을 때 배송 조회에 오늘 날짜 출력
function todayDate() {
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let date = ('0' + today.getDate()).slice(-2);
  let result = `${year}-${month}-${date}`;
  return result;
}

orderHistory();
