import { Router } from 'express';

import { sendEmail, makeCode } from '../services/mail-service';
import { authMailService } from '../services/authMail-service';
import User from '../db/schemas/user-schema';

const mailRouter = Router();

mailRouter.post('/checkCode', async (req, res, next) => {
  try {
    const { checkCode } = req.body;
    const checkedCode = await authMailService.getAuthMailCode(checkCode);
    res.send(checkedCode);
  } catch (error) {
    next(error);
  }
});

mailRouter.post('/', async (req, res, next) => {
  const { email } = req.body;

  try {
    const getmailCode = await authMailService.addAuthMailCode();

    await sendEmail(email, getmailCode.name);
    res.status(200).json({
      getmailCode: `${getmailCode}`,
    });
  } catch (error) {
    next(error);
  }
});

// mailRouter.post('/findpassword', async (req, res, next) => {
//   const { email } = req.body;

//   try {
//     const getmailCode = await authMailService.addAuthMailCode();

//     await sendEmail(email, getmailCode.name);
//     res.status(200).json({
//       getmailCode: `${getmailCode}`,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

mailRouter.post('/findpassword', async (req, res, next) => {
  const { email } = req.body;
  // const user = await User.findOne({ email });
  // if (!user) {
  //   throw new Error('해당 메일로 가입된 사용자가 없습니다.');
  // }

  const randompassword = makeCode();

  await User.updateOne(
    { email },
    {
      // hashPassword 로 업데이트 하기
      // passwordReset
      password: hashPassword(randompassword),
      passwordReset: true,
    }
  );

  // 패스워드 발송하기
  await sendEmail(email, '비밀번호 변경', randompassword);
});

mailRouter.post('/change-password', async (req, res, next) => {
  const { currentPassword, password } = req.body;
  const user = await User.findOne({ shortId: req.user.shortId });

  if (user.password !== hashPassword(currentPassword)) {
    throw new Error('임시 비밀번호가 일치하지 않습니다.');
  }

  await User.updateOne(
    { shortId: user.shortId },
    {
      password: hashPassword(password),
      passwordReset: false,
    }
  );
  d;

  res.redirect('/logout');
});
export { mailRouter };
