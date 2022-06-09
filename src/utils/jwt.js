import jwt from 'jsonwebtoken';
import { userModel } from '../db';

// type: "access" or "refresh"

// 새로운 토큰 생성
const generate = async (userId, type) => {
  const user = await userModel.findById(userId);

  let payload;
  let key;
  let option;

  if (type === 'access') {
    payload = { userId: user._id, role: user.role };
    key = process.env.ACCESS_TOKEN_SECRET_KEY;
    option = {
      expiresIn: '30d',
    };
  } else if (type === 'refresh') {
    payload = { userId: user._id };
    key = process.env.REFRESH_TOKEN_SECRET_KEY;
    option = {
      expiresIn: '30d',
    };
  }

  return jwt.sign(payload, key, option);
};

// 토큰 검증
const verify = (token, type) => {
  try {
    let key;
    if (type === 'access') {
      key = process.env.ACCESS_TOKEN_SECRET_KEY;
    } else if (type === 'refresh') {
      key = process.env.REFRESH_TOKEN_SECRET_KEY;
    }
    return jwt.verify(token, key);
  } catch (err) {
    return {
      result: 'Token Validation Failed',
      reason: err.message,
    };
  }
};

export { generate, verify };
