import { navRender } from '../components/header.js';

navRender();

if (sessionStorage.getItem('email') !== 'manager@gmail.com') {
  alert('관리자만 접근이 가능합니다.');
  window.location.href = '/login';
}
