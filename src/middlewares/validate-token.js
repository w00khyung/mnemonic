import jwt from 'jsonwebtoken';
import { convertExpToMaxAge, generate, verify } from '../utils/jwt';

async function validateToken(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;

  // if (accessToken && refreshToken) {
  //   // 1. 토큰이 모두 유효한 경우 => 검증 후 통과
  //   try {
  //     const accessDecoded = verify(accessToken, 'accessToken');
  //     const { userId } = accessDecoded;
  //     const user = userModel.findById(userId);
  //     verify(refreshToken, 'refresh');
  //     return res.status(200).json({
  //       message: '토큰이 모두 유효합니다.',
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // access token이 없을 때
  if (!accessToken) {
    // 2. access, refresh token 모두 없을 때
    if (!refreshToken) {
      // access token, refresh token 모두 만료됐을 경우 => 재로그인
      // DB에 들어있는 refresh token 폐기 xxx => 로그인할 때 새로 발급함
      // await userModel.update({ userId, update: { refreshToken: null } });
      res.status(401).json({
        message: 'API 사용 권한이 없습니다. (재로그인 필요).',
      });
    } else {
      // 3. access는 없으나, refresh는 있을 때
      // 리프레쉬 토큰이 있으면 검증 후 access token 재발급
      try {
        const { userId } = verify(refreshToken, 'refresh');
        const newAccessToken = await generate(userId, 'access');
        const { exp } = jwt.decode(newAccessToken);
        const data = { accessToken: newAccessToken, exp };
        const maxAge = convertExpToMaxAge(exp);
        res.cookie('accessToken', newAccessToken, {
          maxAge,
        });
        res.status(200).json({
          message: 'refresh token이 유효합니다. access token을 재발급 합니다.',
          data,
        });
      } catch (err) {
        next(err);
      }
    }
  }
}

export { validateToken };
