import { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    shippingInfo: {
      name: String,
      phoneNumber: String,
      address: {
        type: new Schema(
          {
            postalCode: String,
            address1: String,
            address2: String,
          },
          {
            _id: false,
          }
        ),
        required: true,
      },
    },
    orderInfo: {
      type: new Schema(
        {
          item: Array,
          totalAmount: Number,
          status: {
            type: String,
            required: false,
            default: '상품 준비중',
          },
        },
        {
          _id: false,
        }
      ),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export { OrderSchema };
