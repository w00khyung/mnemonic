import { orderModel } from '../db';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  // 주문 정보 저장 (주문 완료)
  async addOrder(info) {
    const orderData = await this.orderModel.create(info);
    return orderData;
  }

  async getOrderList(user) {
    const findOrderList = await this.orderModel.findById(user);
    return findOrderList;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
