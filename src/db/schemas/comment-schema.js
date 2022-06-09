import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },

    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },

    // 0이면 부모 대댓글시 1로 바뀌자!
    parentComment: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'commnets',
    timestamps: true,
  }
);

export { CommentSchema };
