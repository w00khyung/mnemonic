import * as Api from '/api.js';
import { navRender } from '../components/header.js';
import {
  productTitle,
  productCategory,
  productItemList,
} from '../components/product.js';

navRender();
productTitle();
productCategory();
productItemList();