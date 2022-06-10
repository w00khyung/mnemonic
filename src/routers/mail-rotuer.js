import { Router } from 'express';

import { sendEmail } from '../services/mail-service';
import { authMailService } from '../services/authMail-service';

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
export { mailRouter };
