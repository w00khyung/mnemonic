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

  // 댓글 수를 10개로 제한하고 page가 2일경우 10개를 스킵하고 11개부터 출력
  async findByPost(postId, page, limit) {
    const comment = await Comment.find({ post: postId })
      .populate({
        path: 'writer',
        select: { password: 0, address: 0 },
      })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return comment;
  }

  // 댓글 수전체 출력
  async findByAllPostCount(postId, page, limit) {
    const comment = await Comment.find({ post: postId }).count();

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
  async deleteComment(commentId) {
    await Comment.deleteOne({ _id: commentId });
  }
}

const commentModel = new CommentModel();

export { commentModel };
