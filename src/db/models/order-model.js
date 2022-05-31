import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  async findById(user) {
    const findUser = await Order.findOne({ user });
    return findUser;
  }
}

const orderModel = new OrderModel();

export { orderModel };
