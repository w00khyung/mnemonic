import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  async findById(userId) {
    const findUser = await Order.find({ orderer: userId, deletedAt: null });
    return findUser;
  }

  async findAll() {
    const orders = await Order.find({ deletedAt: null }).populate(
      'orderer',
      'fullName email phoneNumber'
    );
    return orders;
  }

  async deleteOrder({ orderId }) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false };

    const findDeleteOrder = await Order.findOneAndUpdate(
      filter,
      { deletedAt: new Date() },
      option
    );
    return findDeleteOrder;
  }
}

const orderModel = new OrderModel();

export { orderModel };
