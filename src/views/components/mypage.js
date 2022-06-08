function mypageNavigation() {
  const mypageContainerLeft = document.querySelector(".mypage-container-left");

  const mypageNav = `<h2><a href="/mypage">마이페이지</a></h2>
  <ul>
    <h3>쇼핑 정보</h3>
    <li><a class="mypage-li-list" href="/mypage/orders/">구매 내역</a></li>
    <li><a class="mypage-li-list" href="/mypage/sale">판매 내역</a></li>
  </ul>
  <ul>
    <h3>내 정보</h3>
    <li><a class="mypage-li-list" href="/mypage/profile">프로필 정보</a></li>
    <li><a class="mypage-li-list" href="#">주소록</a></li>
  </ul>
  </ul>`;

  mypageContainerLeft.innerHTML = mypageNav;
}

export { mypageNavigation };


