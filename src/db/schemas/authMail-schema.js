import { Schema } from 'mongoose';

const AuthoMailSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'authMail',
    timestamps: true,
  }
);
export { AuthoMailSchema };
