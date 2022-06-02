import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { orderService } from '../services';
import { adminRequired } from '../middlewares';

const orderRouter = Router();

// 주문 정보 저장 (주문 완료)
orderRouter.post('/', async (req, res, next) => {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    // 현재 주문하는 유저와 주문 정보를 req에서 받아와서 저장
    const orderer = req.currentUserId;
    const { recipient, purchaseOrderInfo } = req.body;

    const result = await orderService.addOrder({
      orderer,
      recipient,
      purchaseOrderInfo,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// 특정 사용자의 주문 내역 조회
orderRouter.get('/', async (req, res, next) => {
  try {
    const user = req.currentUserId;
    const result = await orderService.getOrderList(user);
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// 주문 내역 삭제 (본인)
orderRouter.delete('/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    await orderService.deleteOrder(orderId);

    res.status(200).json({
      messaege: '주문 정보가 정상적으로 삭제되었습니다.',
    });
  } catch (err) {
    next(err);
  }
});

// 전체 사용자의 주문 내역 조회 (관리자 전용)
orderRouter.get('/admin', adminRequired, async (req, res, next) => {
  try {
    const result = await orderService.getAllOrderList();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// 주문 내역 삭제 (관리자 전용)
orderRouter.delete('/admin/:orderId', adminRequired, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    await orderService.deleteOrder(orderId);

    res.status(200).json({
      messaege: '주문 정보가 정상적으로 삭제되었습니다.',
    });
  } catch (err) {
    next(err);
  }
});

export { orderRouter };
