import * as Api from '/api.js';
import { navRender } from '../components/header.js';

navRender();

const productList = await Api.get(`/api/product/productlist`);
console.log(productList);
