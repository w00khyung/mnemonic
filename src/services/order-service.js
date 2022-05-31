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

  // 특정 사용자의 주문 내역 조회
  async getOrderList(user) {
    const findOrderList = await this.orderModel.findById(user);
    return findOrderList;
  }

  // 전체 사용자의 주묵 내역 조회
  async getAllOrderList() {
    const findAllOrderList = await this.orderModel.findAll();
    return findAllOrderList;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
