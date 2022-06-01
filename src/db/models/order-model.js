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

  async deleteOrder(user, orderNum) {
    const findDeleteOrder = await Order.find({ user }).skip(orderNum);
    const willDeleteOrder = await Order.deleteOne({
      _id: findDeleteOrder[0]._id.toString(),
    });
    return willDeleteOrder;
  }
}

const orderModel = new OrderModel();

export { orderModel };
