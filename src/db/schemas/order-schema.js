import { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    orderer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    recipient: {
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
    purchaseOrderInfo: {
      type: new Schema(
        {
          products: Array,
          totalAmount: Number,
          shippingStatus: {
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
