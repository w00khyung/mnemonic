import { Router } from 'express';

import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { productService } from '../services';

const productRouter = Router();

// 상품추가 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
productRouter.post('/register', loginRequired, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    // jwt에서 sellerId 받아오기
    const sellerId = req.currentUserId;

    // req (request)의 body 에서 데이터 가져오기
    const { name, price, brand, content, imagePath, category } = req.body;

    // 위 데이터를 제품 db에 추가하기
    const newProduct = await productService.addProduct({
      name,
      price,
      brand,
      content,
      imagePath,
      sellerId,
      category,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// 전체 상품 목록을 가져옴 (배열 형태임)
productRouter.get('/productlist', async (req, res, next) => {
  try {
    // 전체 제품 목록을 얻음
    const products = await productService.getProducts();

    // 제품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 카테고리별 상품 목록을 가져옴 (배열 형태임) AND 특정 개수 출력 모두 출력아님!
productRouter.post('/category/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { start, end } = req.body;
    const products = await productService.getCategoryProducts(
      categoryId,
      Number(start),
      Number(end)
    );

    // 제품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 사용자의 판매 상품 목록들을 가져옴 (배열 형태임)
productRouter.post('/seller', async (req, res, next) => {
  try {
    const { userId } = req.body;

    const products = await productService.getSellerProducts(userId);

    // 제품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 상품 정보 수정
// (예를 들어 /api/products/abc12345 로 요청하면 req.params.productId는 'abc12345' 문자열로 됨)
productRouter.patch(
  '/products/:productId',
  loginRequired,
  async (req, res, next) => {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요'
        );
      }
      const curretUserId = req.currentUserId;

      // params로부터 id를 가져옴
      const { productId } = req.params;

      // body data 로부터 업데이트할 사용자 정보를 추출함.
      const { name, price, brand, content, imagePath } = req.body;

      const productInfoRequired = productId;

      // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
      // 보내주었다면, 업데이트용 객체에 삽입함.
      const toUpdate = {
        ...(name && { name }),
        ...(price && { price }),
        ...(brand && { brand }),
        ...(content && { content }),
        ...(imagePath && { imagePath }),
      };

      // 제품 정보를 업데이트함.
      const updatedProductInfo = await productService.setProduct(
        productInfoRequired,
        toUpdate,
        curretUserId
      );

      // 업데이트 이후의 제품 데이터를 프론트에 보내 줌
      res.status(200).json(updatedProductInfo);
    } catch (error) {
      next(error);
    }
  }
);

// 유저 상품 정보 수정
productRouter.patch(
  '/products/user/:productId',
  loginRequired,
  async (req, res, next) => {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요'
        );
      }

      // params로부터 id를 가져옴
      const { productId } = req.params;

      // body data 로부터 업데이트할 사용자 정보를 추출함.
      const { name, price, brand, content, imagePath } = req.body;

      const productInfoRequired = productId;

      // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
      // 보내주었다면, 업데이트용 객체에 삽입함.
      const toUpdate = {
        ...(name && { name }),
        ...(price && { price }),
        ...(brand && { brand }),
        ...(content && { content }),
        ...(imagePath && { imagePath }),
      };

      // 제품 정보를 업데이트함.
      const updatedProductInfo = await productService.setUserProduct(
        productInfoRequired,
        toUpdate
      );

      // 업데이트 이후의 제품 데이터를 프론트에 보내 줌
      res.status(200).json(updatedProductInfo);
    } catch (error) {
      next(error);
    }
  }
);

// 상품 상세
productRouter.get('/detail/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const getProductId = await productService.getProduct(productId);

    res.status(200).json(getProductId);
  } catch (error) {
    next(error);
  }
});

// 상품 삭제
productRouter.delete(
  '/delete/:productId',
  loginRequired,
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      await productService.deleteProduct(productId);
      const success = {
        status: 200,
        message: '상품이 정상적으로 삭제했습니다.',
      };
      res.status(200).json(success);
    } catch (error) {
      next(error);
    }
  }
);
export { productRouter };
