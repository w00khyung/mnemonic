import { Router } from 'express';
// multipart/form-data 핸들링을 위한 multer를 추가
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import util from 'util';

import { uploadFile, getFileStream } from '../services/s3-service';

const unlinkFile = util.promisify(fs.unlink);

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads/');
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname);
    const basename = path.basename(
      Math.round(Math.random() * 1e9).toString(),
      extension
    );
    callback(null, `${basename}-${Date.now()}${extension}`);
  },
});

// 1. multer 미들웨어 등록
const upload = multer({
  storage,
});

const uploadRouter = Router();

uploadRouter.get('/images/:key', (req, res) => {
  const { key } = req.params;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});

uploadRouter.post(
  '/imageUpload',
  upload.single('photo'),
  async (req, res, next) => {
    const { file } = req;

    try {
      const result = await uploadFile(file);

      await unlinkFile(file.path);
      const success = {
        imageUrl: result.Location,
      };
      res.send(success);

      // 복구하기
      // const { file } = req;
      // console.log(file);
      // const imgUrl = 'http://localhost:5000/uploads/';
      // // 4. 파일 정보
      // const result = {
      //   originalName: file.originalname,
      //   size: file.size,
      //   path: file.path,
      //   file: imgUrl + file.filename,
      // };
      // res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export { uploadRouter };
