import jwt from 'jsonwebtoken';
import { userModel } from '../db';

async function loginRequired(req, res, next) {
  // request 헤더로부터 authorization bearer 토큰을 받음.
  const accessToken = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.headers.authorization?.split(' ')[2];

  // 이 토큰은 jwt 토큰 문자열이거나, 혹은 "null" 문자열이거나, undefined임.
  // 토큰이 "null" 일 경우, login_required 가 필요한 서비스 사용을 제한함.
  // 코드 정리가 필요할 것 같습니다..
  if (!accessToken || accessToken === 'null') {
    // 1. access, refresh token 둘 다 없을 경우 로그인으로
    if (!refreshToken || refreshToken === 'null') {
      console.log(
        '서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음'
      );
      res.status(403).json({
        result: 'forbidden-approach',
        reason: '로그인한 유저만 사용할 수 있는 서비스입니다.',
      });
    } else {
      // 2. access token은 없으나, refresh token는 있는 경우 => access 토큰 재발급
      try {
        const refreshTokenDecoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET_KEY
        );
        // 전달받은 refresh token이 DB에 있는 것과 일치하는지 검증
        const user = await userModel.findById(refreshTokenDecoded.userId);
        // 일치하면 access token으로 새로 발급함.
        if (refreshToken === user.refreshToken) {
          // 새로 발급해서 access token을 세션에 저장함.
          const accessTokenDecoded = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: '2h' }
          );
          sessionStorage.setItem('accessToken', accessTokenDecoded);
          req.currentUserId = user._id;
          next();
        } else {
          res.status(403).json({
            result: 'forbidden-approach',
            reason:
              'refresh token이 일치하지 않습니다. access token을 재발급하지 않습니다. 다시 로그인 해주세요.',
          });
        }
      } catch (err) {
        res.status(403).json({
          result: 'forbidden-approach',
          reason: 'refresh token이 정상적인 토큰이 아닙니다.',
        });
      }
    }
    return;
  }
  if (!refreshToken || refreshToken === 'null') {
    // 3. access는 있으나, refresh는 없는 경우 => refresh 재발급
    try {
      const accessTokenDecoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );

      const { userId } = accessTokenDecoded;

      const user = await userModel.findById(accessTokenDecoded.userId);
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
          expiresIn: '14d',
        }
      );
      await userModel.generateRefreshToken(user._id, refreshToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      req.currentUserId = userId;
      next();
    } catch (error) {
      // jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
      // 403 코드로 JSON 형태로 프론트에 전달함.
      res.status(403).json({
        result: 'forbidden-approach',
        reason: 'access token이 정상적인 토큰이 아닙니다.',
      });
    }
  } else {
    // 4. access, refresh 모두 있을 경우
    try {
      const accessTokenDecoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );

      const { userId } = accessTokenDecoded;
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
      const user = await userModel.findById(userId);
      if (refreshToken === user.refreshToken) {
        next();
      }
    } catch (error) {
      res.status(403).json({
        result: 'forbidden-approach',
        reason: '정상적인 토큰이 아닙니다.',
      });
    }
  }
}

export { loginRequired };
