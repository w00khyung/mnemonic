import express from 'express';
import path from 'path';

const viewsRouter = express.Router();
// views폴더 내의 ${resource} 폴더 내의 모든 파일을 웹에 띄우며,
// 이 때 ${resource}.html 을 기본 파일로 설정함.
function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  // express.static 은 express 가 기본으로 제공하는 함수임
  return express.static(resourcePath, option);
}

// 페이지별로 html, css, js 파일들을 라우팅함
// 아래와 같이 하면, http://localhost:5000/ 에서는 views/home/home.html 파일을,
// http://localhost:5000/register 에서는 views/register/register.html 파일을 화면에 띄움
viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/register', serveStatic('register'));
viewsRouter.use('/login', serveStatic('login'));
viewsRouter.use('/mypage', serveStatic('mypage'));
viewsRouter.use('/profile', serveStatic('profile'));
viewsRouter.use('/cart', serveStatic('cart'));
viewsRouter.use('/order', serveStatic('order'));
viewsRouter.use('/addproduct', serveStatic('addproduct'));
viewsRouter.use('/order/complete', serveStatic('complete'));
viewsRouter.use('/mypage/orders', serveStatic('mypage-orders'));
viewsRouter.use('/admin', serveStatic('admin'));
viewsRouter.use('/orders/admin', serveStatic('admin-orders'));

// 제품 리스트
viewsRouter.use('/product', serveStatic('product'));

// 제품 상세페이지
viewsRouter.use('/product-detail', serveStatic('product-detail'));

// 제품 카테고리 분류
viewsRouter.use('/product-clothing', serveStatic('product-clothing'));
viewsRouter.use('/product-top', serveStatic('product-top'));
viewsRouter.use('/product-outer', serveStatic('product-outer'));
viewsRouter.use('/product-pants', serveStatic('product-pants'));
viewsRouter.use('/product-onepiece', serveStatic('product-onepiece'));
viewsRouter.use('/product-skirt', serveStatic('product-skirt'));
viewsRouter.use('/product-accessories', serveStatic('product-accessories'));
viewsRouter.use('/product-bag', serveStatic('product-bag'));
viewsRouter.use('/product-sneakers', serveStatic('product-sneakers'));
viewsRouter.use('/product-shoes', serveStatic('product-shoes'));
viewsRouter.use('/product-watch', serveStatic('product-watch'));
viewsRouter.use('/product-hat', serveStatic('product-hat'));
viewsRouter.use('/product-socks', serveStatic('product-socks'));

// views 폴더의 최상단 파일인 rabbit.png, api.js 등을 쓸 수 있게 함
viewsRouter.use('/', serveStatic(''));

export { viewsRouter };
