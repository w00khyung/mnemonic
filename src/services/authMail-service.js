import { authMailModel } from '../db';

class AuthMailService {
  constructor(authMailModel) {
    this.authMailModel = authMailModel;
  }

  async addAuthMailCode() {
    // db에 저장
    const authMailCode = Math.floor(Math.random() * 10 ** 8)
      .toString()
      .padStart(8, '0');

    const createdNewCode = await this.authMailModel.create(authMailCode);

    return createdNewCode;
  }

  async getAuthMailCode(authMailCode) {
    const mailCode = await this.authMailModel.findAndDeleteByAuthMail(
      authMailCode
    );

    if (!mailCode) {
      const resultCode = {
        status: 200,
        result: 'fail',
      };
      return resultCode;
    }
    const resultCode = {
      status: 200,
      result: 'success',
    };
    return resultCode;
  }

  async deleteAuthMail(authMailCode) {
    await this.authMailModel.deleteUser(authMailCode);
  }
}

const authMailService = new AuthMailService(authMailModel);

export { authMailService };
