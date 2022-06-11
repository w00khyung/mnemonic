import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { socialLoginService, userService } from '../services';
import { convertExpToMaxAge } from '../utils/jwt';

const socialLoginRouter = Router();

// 소셜 로그인 (카카오톡)
socialLoginRouter.get('/kakao', async (req, res, next) => {
  try {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
    res.redirect(kakaoAuthUrl);
  } catch (err) {
    next(err);
  }
});

socialLoginRouter.get('/kakao/callback', async (req, res, next) => {
  try {
    const {
      query: { code },
    } = req;

    const userData = await socialLoginService.kakaoLogin(code);
    const { isRegister, email, fullName } = userData;
    const password = 'kakao';
    // 로그인했던 적이 있으면 바로 로그인을 시켜주고 회원가입 절차는 생략함.
    if (!isRegister) {
      await userService.addUser({
        email,
        fullName,
        password,
      });
    }

    const { accessToken, refreshToken } = await userService.getUserToken({
      email,
      password,
    });

    const accessExp = jwt.decode(accessToken).exp;
    const refreshExp = jwt.decode(refreshToken).exp;

    const accessMaxAge = convertExpToMaxAge(accessExp);
    const refreshMaxAge = convertExpToMaxAge(refreshExp);

    // jwt 토큰을 쿠키에 저장함.
    res.cookie('accessToken', accessToken, {
      maxAge: accessMaxAge,
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: refreshMaxAge,
    });
    res.cookie('email', email);
    res.status(200).redirect('/');
  } catch (err) {
    next(err);
  }
});

export { socialLoginRouter };
