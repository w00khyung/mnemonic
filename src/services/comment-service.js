import { commentModel } from '../db';

class CommentService {
  // 본 파일의 맨 아래에서, new CommentService(commentModel) 하면, 이 함수의 인자로 전달됨
  constructor(commentModel) {
    this.commentModel = commentModel;
  }

  // 댓글 등록
  async addComment(commentInfo) {
    // 객체 destructuring
    const { post, writer, comment } = commentInfo;

    const newProductInfo = {
      post,
      writer,
      comment,
    };
    // db에 저장
    const createdNewComment = await this.commentModel.create(newProductInfo);

    return createdNewComment;
  }

  // 대댓글 등록
  async addSubComment(commentInfo) {
    // 객체 destructuring
    const { post, writer, comment } = commentInfo;

    const newProductInfo = {
      post,
      writer,
      parentComment: 1,
      comment,
    };

    // db에 저장
    const createdNewComment = await this.commentModel.create(newProductInfo);
    return createdNewComment;
  }

  // 디비에 저장된 모든 데이터 불러옴.
  async getAllComments() {
    const commnets = await this.commentModel.findAll();
    return commnets;
  }

  // 댓글 수정, commentId필요
  async setComment(commentInfoRequierd, toUpdate, curretUserId) {
    const commentId = commentInfoRequierd;

    // 우선 해당 id의 상품이 db에 있는지 확인
    let comment = await this.commentModel.findById(commentId);
    // if (comment.writer._id !== curretUserId) {
    //   throw new Error(
    //     '댓글적은자와 사용자의 ID가 틀립니다. 다시 한번 확인해주세요'
    //   );
    // }
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!comment) {
      throw new Error('제품이 없습니다. 다시 한 번 확인해 주세요.');
    }

    comment = await this.commentModel.update({
      commentId,
      update: toUpdate,
    });
    // 수정된 값 출력
    return comment;
  }

  // 해당 댓글 정보 가져오기
  async getComment(commentId) {
    // 우선 해당 id의 댓글이 db에 있는지 확인
    const comment = await this.commentModel.findById(commentId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!comment) {
      throw new Error('제품이 없습니다. 다시 한 번 확인해 주세요.');
    }
    return comment;
  }

  // 댓글 삭제
  async deleteComment(commentId) {
    await this.commentModel.deleteComment(commentId);
  }

  //  포스터별 댓글들 가져오기 크키만큼!
  async getPostComments(postId, page = 1, limit = 10) {
    const comments = await this.commentModel.findByPost(postId, page, limit);
    if (!comments) {
      const stuckComments = 0;
      return stuckComments;
    }
    return comments;
  }

  //  포스터별 댓글들 가져오기 크키만큼!
  async getAllPostComments(postId) {
    const comments = await this.commentModel.findByAllPostCount(postId);
    if (!comments) {
      const stuckComments = 0;
      return stuckComments;
    }
    return comments;
  }

  // 작성자별 댓글들 모두 가져오기
  async getWriterComments(writerId) {
    const comments = await this.commentModel.findByWriter(writerId);
    if (!comments) {
      const stuckComments = 0;
      return stuckComments;
    }
    return comments;
  }
}

const commentService = new CommentService(commentModel);

export { commentService };
