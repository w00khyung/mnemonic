import * as Api from '/api.js';
import { addHyphen } from '/useful-functions.js';
import { navRender } from '../components/header.js';
import { pageScroll } from '../components/pagescroll.js';
import { mypageNavigation } from '../components/mypage.js';

const proFileName = document.querySelector('.mypage-user-profile-name');
const proFileEmail = document.querySelector('.mypage-user-profile-email');
const proFilePhone = document.querySelector('.mypage-user-profile-phone');
const proFileRole = document.querySelector('.mypage-user-profile-role');

navRender();
pageScroll();
mypageNavigation();

// get userInfo
const userList = await Api.get(`/api/userlist`, '', true);
const email = sessionStorage.getItem('email');

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
