import { model } from 'mongoose';
import { AuthoMailSchema } from '../schemas/authMail-schema';

const AuthMail = model('authMail', AuthoMailSchema);

export class AuthMailModel {
  async create(authMailCode) {
    const createdAuthMail = await AuthMail.create({ name: authMailCode });

    return createdAuthMail;
  }

  async findAndDeleteByAuthMail(authMailCode) {
    const authMail = await AuthMail.findOneAndDelete({ name: authMailCode });
    return authMail;
  }
}

const authMailModel = new AuthMailModel();

export { authMailModel };
