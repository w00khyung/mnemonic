import jwt from 'jsonwebtoken';
import { generate, verify } from '../utils/jwt';

async function validateToken(req, res, next) {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.headers.authorization?.split(' ')[2];

  if (accessToken && refreshToken) {
    const accessDecoded = verify(accessToken, 'access');

    if (!accessDecoded) {
      res.status(401).json({
        message: 'access token이 정상적인 토큰이 아닙니다.',
      });
    }

    const refreshDecoded = verify(refreshToken, 'refresh');
    if (accessDecoded.reason === 'jwt expired') {
      // 1. access token, refresh token 모두 만료됐을 경우 => 재로그인
      // DB에 들어있는 refresh token 폐기
      if (refreshDecoded.reason === 'jwt expired') {
        res.status(401).json({
          message: '토큰이 모두 만료 되었습니다. 다시 로그인 해주세요.',
        });
      } else {
        // 2. access token은 만료 되었으나, refresh token이 만료되지 않았을 경우 => refresh 검증 후 access token 재발급
        try {
          const { userId } = verify(refreshToken, 'refresh');
          const newAccessToken = await generate(userId, 'access');
          const { exp } = jwt.decode(newAccessToken);
          const data = { accessToken: newAccessToken, exp };
          res.status(200).json({
            message:
              'refresh token이 유효합니다. access token을 재발급 합니다.',
            data,
          });
        } catch (err) {
          next(err);
        }
      }
    } else if (accessDecoded.result !== 'Token Validation Failed') {
      // 3. access는 만료되지 않았으나, refresh가 만료된 경우 => refresh 재발급 후 DB에 저장
      // => 재로그인 하는게 맞는지?
    } else {
      res.status(200).json({
        message: '토큰이 모두 유효합니다.',
      });
    }
  } else {
    // access token, refresh token이 비어있는 경우
    res.status(400).json({
      message: 'access token이나 refresh token이 존재하지 않습니다.',
    });
  }
}

export { validateToken };
