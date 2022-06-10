import { Router } from 'express';
import { socialLoginService, userService } from '../services';

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
    // 로그인했던 적이 있으면 바로 로그인을 시켜주고 회원가입 절차는 생략!
    if (!isRegister) {
      await userService.addUser({
        email,
        fullName,
        password: 'kakao',
      });
    }

    const userToken = await userService.getUserToken({
      email,
      password: 'kakao',
    });

    // 프론트 단에는 최종적으로 userToken을 넘겨줘야함.
    res.status(200).json(userToken);
  } catch (err) {
    next(err);
  }
});

export { socialLoginRouter };
