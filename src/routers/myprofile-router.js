import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { userService } from '../services';

const myprofileRouter = Router();
// 사용자 정보
/**
 * 1. 프론트에서 userId값 받아오기
 * 2. userId를 통해 db에서 값 찾기
 * 3. 값을 찾을
 */

myprofileRouter.get('/', loginRequired, async function (req, res, next) {
  try {
    const userId = req.currentUserId;
    const getUserInfo = await userService.getUser(userId);

    res.status(200).json(getUserInfo);
  } catch (error) {
    next(error);
  }
});

myprofileRouter.delete(
  '/delete',
  loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      await userService.deleteUser(userId);
      const ok = { success: 'success' };
      res.status(200).json(ok);
    } catch (error) {
      next(error);
    }
  }
);

export { myprofileRouter };
