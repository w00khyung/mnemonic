import * as Api from '/api.js';
import { navRender } from '../../components/header.js';

navRender();

if (sessionStorage.getItem('email') === 'manager@gmail.com') {
  handleProductCategory();
} else {
  alert('관리자만 접근이 가능합니다.');
  window.location.href = '/login';
}

async function handleProductCategory() {
  const categoryList = await Api.get(`/api/category/categorylist`);
  console.log(categoryList);
}
