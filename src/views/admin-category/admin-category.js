import { adminnavRender } from '/components/admin-header.js';
import * as Api from '/api.js';

if (sessionStorage.getItem('email') === 'manager@gmail.com') {
  adminnavRender();
  handleProductCategory();
} else {
  alert('관리자만 접근이 가능합니다.');
  window.location.href = '/login';
}

async function handleProductCategory() {
  const categoryList = await Api.get(`/api/category/categorylist`);
  console.log(categoryList);
}
