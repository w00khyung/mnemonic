import { adminnavRender } from '/components/admin-header.js';

if (sessionStorage.getItem('email') === 'manager@gmail.com') {
  adminnavRender();
} else {
  alert('관리자만 접근이 가능합니다.');
  window.location.href = '/login';
}
