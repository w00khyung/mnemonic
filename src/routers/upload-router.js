import { Router } from 'express';
// multipart/form-data 핸들링을 위한 multer를 추가
import multer from 'multer';
import path from 'path';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
// // Amazon Cognito 인증 공급자를 초기화합니다
// AWS.config.region = 'ap-northeast-2'; // 리전
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'ap-northeast-2:1921d3e9-5424-472b-8eaa-809400424aef',
// });

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
    let extension = path.extname(file.originalname);
    let basename = path.basename(
      Math.round(Math.random() * 1e9).toString(),
      extension
    );
    callback(null, basename + '-' + Date.now() + extension);
  },
});

// 1. multer 미들웨어 등록
let upload = multer({
  storage: storage,
});

// aws.config.loadFromPath(__dirname + '/../../config/s3.json');

// const s3 = new aws.S3();
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'shopping-elice-bucket', // 버킷 이름
//     contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
//     acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
//     key: (req, file, cb) => {
//       console.log(file);
//       cb(null, file.originalname);
//     },
//   }),
// });

const uploadRouter = Router();
uploadRouter.post(
  '/imageUpload',
  upload.single('photo'),
  async (req, res, next) => {
    try {
      let file = req.file;
      console.log(file);
      const imgUrl = 'http://localhost:5002/uploads/';
      // 4. 파일 정보
      let result = {
        originalName: file.originalname,
        size: file.size,
        path: file.path,
        file: imgUrl + file.filename,
      };
      res.json(result);

      // console.log('file ::: ', req.files);
      // for (let i = 0; i < req.file.length; i++) {
      //   console.log('image url ::: ', req.files[i].location);
      // }
      // res.status(201).send('success');
    } catch (error) {
      next(error);
    }
  }
);

export { uploadRouter };
