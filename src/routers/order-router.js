import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { orderService } from '../services';

const orderRouter = Router();

// 사용자 주문 내역 조회 api
// orderRouter.get('/orderlist', async (req, res, next) => {
//   try {
//     const userId = req.currentUserId;
//     const orderList = orderService.getOrderList(userId);
//     res.json(orderList);
//   } catch (error) {
//     next(error);
//   }
// });

// 주문 정보 저장 (주문 완료)
orderRouter.post('/order', async (req, res, next) => {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    // 현재 주문하는 유저와 주문 정보를 req에서 받아와서 저장
    const user = req.currentUserId;
    const { shippingInfo, orderInfo } = req.body;
    orderService.addOrder({ user, shippingInfo, orderInfo });
    res.status(200).json(req.body);
  } catch (err) {
    next(err);
  }
});

export { orderRouter };
