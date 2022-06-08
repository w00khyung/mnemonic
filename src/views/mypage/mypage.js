import * as Api from '/api.js';
import { navRender } from '../components/header.js';
import { mypageNavigation } from '../components/mypage.js';
import { adminnavRender } from '/components/admin-header.js';

if (sessionStorage.getItem('email') === 'manager@gmail.com') {
  adminnavRender();
} else {
  navRender();
}

mypageNavigation();