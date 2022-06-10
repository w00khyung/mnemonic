import { orderModel } from '../db';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  // 주문 정보 저장 (주문 완료)
  async addOrder(purchaseOrderInfo) {
    const purchaseOrderData = await this.orderModel.create(purchaseOrderInfo);
    return purchaseOrderData;
  }

  // 특정 사용자의 주문 내역 조회
  async getOrderList(user) {
    const findOrderList = await this.orderModel.findById(user);

    // DB에 들어가있는 주문 정보에서 필요한 것만 필터링 (날짜, 주문 정보, 상태)
    return findOrderList.map((order) => ({
      _id: order._id,
      purchaseOrderInfo: order.purchaseOrderInfo,
      createdAt: order.createdAt,
    }));
  }

  // 특정 사용자의 주문 내역 삭제
  async deleteOrder(orderId) {
    const willDeleteOrder = await this.orderModel.deleteOrder({ orderId });
    return willDeleteOrder;
  }

  // 전체 사용자의 주문 내역 조회
  async getAllOrderList() {
    const findAllOrderList = await this.orderModel.findAll();
    return findAllOrderList;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
