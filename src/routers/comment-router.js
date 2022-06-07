import { Router } from 'express';

import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { commentService } from '../services';

const commentRouter = Router();

// 댓글/대댓글 등록
commentRouter.post('/', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    // jwt에서 writerId 받아오기
    const writerId = req.currentUserId;

    // req (request)의 body 에서 데이터 가져오기
    const { post, parentComment, comment } = req.body;
    if (parentComment < 1) {
      const newProduct = await commentService.addComment({
        post,
        writerId,
        comment,
      });
      res.status(201).json(newProduct);
    } else {
      const newProduct = await commentService.addSubComment({
        post,
        writerId,
        comment,
      });
      res.status(201).json(newProduct);
    }
  } catch (error) {
    next(error);
  }
});

// 전체 댓글 목록을 가져옴 (배열 형태임)
commentRouter.get('/', async (req, res, next) => {
  try {
    const comments = await commentService.getAllComments();

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

//  포스터별 댓글들 가져오기 크키만큼!
commentRouter.post('/products', async (req, res, next) => {
  try {
    const { productId, start, end } = req.body;
    const products = await commentService.getPostComments(
      productId,
      Number(start),
      Number(end)
    );

    // 제품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 작성자별 댓글들 모두 가져오기
commentRouter.post('/writer', async (req, res, next) => {
  try {
    const { userId } = req.body;

    const products = await commentService.getWriterComments(userId);

    // 제품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 댓글 정보 수정
// (예를 들어 /api/products/abc12345 로 요청하면 req.params.productId는 'abc12345' 문자열로 됨)
commentRouter.patch('/:commentId', loginRequired, async (req, res, next) => {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }
    const curretUserId = req.currentUserId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const { post, writer, parentComment, comment } = req.body;

    const commentIdInfo = req.params.commentId;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(post && { post }),
      ...(writer && { writer }),
      ...(parentComment && { parentComment }),
      ...(comment && { comment }),
    };

    const updatedCommentInfo = await commentService.setComment(
      commentIdInfo,
      toUpdate,
      curretUserId
    );

    res.status(200).json(updatedCommentInfo);
  } catch (error) {
    next(error);
  }
});

// 댓글하나가져오기
commentRouter.get('/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const getComment = await commentService.getComment(commentId);

    res.status(200).json(getComment);
  } catch (error) {
    next(error);
  }
});

commentRouter.delete('/:commentId', loginRequired, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await commentService.deleteProduct(commentId);
    const success = {
      status: 200,
      message: '댓글이 정상적으로 삭제했습니다.',
    };
    res.status(200).json(success);
  } catch (error) {
    next(error);
  }
});
export { commentRouter };
