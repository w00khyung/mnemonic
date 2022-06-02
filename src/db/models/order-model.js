import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  async findById(user) {
    const findUser = await Order.find({ user });
    return findUser;
  }

  async findAll() {
    const orders = await Order.find({});
    return orders;
  }

  async deleteOrder(orderId) {
    const findDeleteOrder = await Order.findOneAndDelete({ _id: orderId });
    return findDeleteOrder;
  }
}

const orderModel = new OrderModel();

export { orderModel };
