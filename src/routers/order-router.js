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
orderRouter.post('/', async (req, res, next) => {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }
    orderService.addOrder(req.body);
    res.status(200).json(req.body);
  } catch (err) {
    next(err);
  }
});

export { orderRouter };
