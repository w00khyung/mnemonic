import jwt from 'jsonwebtoken';
import { orderModel } from '../db';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  // 주문 정보 저장 (주문 완료)
  async addOrder(userId) {
    const orderInfo = await this.orderModel.create(userId);
    return orderInfo;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
