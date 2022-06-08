import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { adminRequired } from '../middlewares';
import { categoryService } from '../services';

const categoryRouter = Router();

categoryRouter.post('/register', adminRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const { name, code, codeRef } = req.body;

    // 위 데이터를 카테고리 DB에 추가하기
    const newCategory = await categoryService.addCategory({
      name,
      code,
      codeRef,
    });

    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

// 전체 카테고리 목록을 가져옴 (배열 형태임)
categoryRouter.get('/categorylist', async (req, res, next) => {
  try {
    // 전체 카테고리 목록을 얻음
    const category = await categoryService.getCategoryAll();

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

// 카테고리 상세
categoryRouter.get('/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const getcategoryId = await categoryService.getCategoryId(categoryId);

    res.status(200).json(getcategoryId);
  } catch (error) {
    next(error);
  }
});

// 카테고리 삭제
categoryRouter.delete('/:categoryId', adminRequired, async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    await categoryService.deleteCategory(categoryId);

    const success = {
      status: 200,
      message: '카테고리가 정상적으로 삭제했습니다.',
    };
    res.status(200).json(success);
  } catch (error) {
    next(error);
  }
});

// 카테고리 코드 삭제
categoryRouter.delete('/code/:code', adminRequired, async (req, res, next) => {
  try {
    const { code } = req.params;

    await categoryService.deleteCategoryCode(code);

    const success = {
      status: 200,
      message: '카테고리가 정상적으로 삭제했습니다.',
    };
    res.status(200).json(success);
  } catch (error) {
    next(error);
  }
});
export { categoryRouter };
