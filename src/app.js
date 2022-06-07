import cors from 'cors';
import express from 'express';
import {
  viewsRouter,
  userRouter,
  orderRouter,
  myprofileRouter,
  productRouter,
  categoryRouter,
  uploadRouter,
  socialLoginRouter,
  mailRouter,
} from './routers';
import { errorHandler, loginRequired } from './middlewares';

const app = express();

// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
app.use(viewsRouter);

// 정적파일 서비스하기--박찬흠 추가
app.use('/uploads', express.static('uploads'));

// api 라우팅
// 아래처럼 하면, userRouter 에서 '/login' 으로 만든 것이 실제로는 앞에 /api가 붙어서
// /api/login 으로 요청을 해야 하게 됨. 백엔드용 라우팅을 구분하기 위함임.
app.use('/api', userRouter);
app.use('/api/orders', loginRequired, orderRouter);
app.use('/api/my', myprofileRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/upload', uploadRouter);
app.use('/auth', socialLoginRouter);
app.use('/api/sendMessage', mailRouter);
// 순서 중요 (errorHandler은 다른 일반 라우팅보다 나중에 있어야 함)
// 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨
app.use(errorHandler);

export { app };
