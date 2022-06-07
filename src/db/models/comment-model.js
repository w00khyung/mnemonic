import { model } from 'mongoose';
import { CommentSchema } from '../schemas/comment-schema';

const Comment = model('comments', CommentSchema);

export class CommentModel {
  async findByWriter(writerId) {
    const comment = await Comment.find({ writer: writerId })
      .populate({
        path: 'writer',
        select: { password: 0, address: 0 },
      })
      .sort({ _id: -1 });

    return comment;
  }

  async findById(commentId) {
    const comment = await Comment.findById({ _id: commentId }).populate({
      path: 'writer',
      select: { password: 0, address: 0 },
    });
    return comment;
  }

  async findByPost(postId) {
    const comment = await Comment.find({ post: postId })
      .populate({
        path: 'writer',
        select: { password: 0, address: 0 },
      })
      .sort({ _id: -1 });
    return comment;
  }

  async create(commentInfo) {
    const createdNewComment = await Comment.create(commentInfo);
    return createdNewComment;
  }

  async findAll() {
    const comments = await Comment.find({});

    return comments;
  }

  async update({ commentId, update }) {
    const filter = { _id: commentId };
    const option = { returnOriginal: false };

    const updatedcomment = await Comment.findOneAndUpdate(
      filter,
      update,
      option
    );
    return updatedcomment;
  }

  // deltecomment 추가
  async deletecomment(commentId) {
    await Comment.deleteOne({ _id: commentId });
  }
}

const commentModel = new CommentModel();

export { commentModel };
