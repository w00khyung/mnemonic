import { model } from 'mongoose';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../schemas/user-schema';

const User = model('users', UserSchema);

export class UserModel {
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }

  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

  async findAll() {
    const users = await User.find({});
    return users;
  }

  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  async generateRefreshToken(userId) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const refreshToken = jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: '14d',
      }
    );
    await User.findOneAndUpdate(filter, { refreshToken }, option);
    return refreshToken;
  }

  async delete(userId) {
    return await User.findOneAndDelete({ _id: userId });
  }
}

const userModel = new UserModel();

export { userModel };
