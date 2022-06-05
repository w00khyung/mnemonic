const UserLogOut = () => {
  if (
    !sessionStorage.getItem('accessToken') &&
    !sessionStorage.getItem('refreshToken')
  ) {
    window.location.href = '/login';
    return;
  }
  const logout = window.confirm('로그아웃 하시겠습니까?');
  if(!logout) return;
  sessionStorage.removeItem('email');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  window.location.href = '/';
};

const onOffLoginOut = () => {
  const logout = document.querySelector('.logout');
  logout.addEventListener('click', UserLogOut);
};

const navSection = () => {
  const isLoggedIn =
    sessionStorage.getItem('accessToken') ||
    sessionStorage.getItem('refreshToken');
  const shoppingMallHeader = document.querySelector('.shopping-mall-header');
  const header = `
  <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="container mt-3">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="/elice-rabbit.png" width="30" height="30" />
        <span class="has-text-link">쇼핑-n팀</span>
      </a>
  
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
  
      <div class="navbar-end breadcrumb my-auto" aria-label="breadcrumbs">
        <ul id="navbar">
        <li><a href="/product">제품페이지</a></li>
        ${isLoggedIn ? `<li><a href="/addproduct">상품등록</a></li>` : ''}
        ${isLoggedIn ? `<li><a href="/mypage">마이페이지</a></li>` : ''}
          <li><a class="logout">${isLoggedIn ? `로그아웃` : `로그인`}</a></li>
          ${isLoggedIn ? '' : `<li><a href="/register">회원가입</a></li>`}
          ${
            isLoggedIn
              ? `<li>
          <a href="/cart" aria-current="page">
            <span class="icon">
              <i class="fas fa-cart-shopping"></i>
            </span>
            <span>카트</span>
          </a>
         
        </li>`
              : ''
          }
        </ul>
      </div>
    </div>
  </div>
  </nav>
  `;
  shoppingMallHeader.innerHTML = header;
};

const navRender = () => {
  navSection();
  onOffLoginOut();
};

export { navRender };
