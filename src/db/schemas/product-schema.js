import { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
  },
  {
    collection: 'products',
    timestamps: true,
  }
);

export { ProductSchema };
