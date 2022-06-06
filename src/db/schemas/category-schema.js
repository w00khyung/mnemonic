import { Schema } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    code: {
      type: Number,
      required: true,
    },
    codeRef: {
      type: Number,
      ref: 'category',
      default: 0,
      required: false,
    },
  },
  {
    collection: 'category',
    timestamps: false,
  }
);

export { CategorySchema };
