import { RequestHandler } from "express";
import { generateCrudRoutes } from "express-easy-curd";
import redis from "../../config/redis";
import { encrypt } from "../../helper/cryptoHelper";
import { validatorMiddleware } from "../../middleware/zodValidator";
import PasswordManagerModel from "./diary.model";
import { diaryCreateValidate, diaryUpdateValidate } from "./diary.validation";
import { disabledMiddleware } from "../../middleware/globalMiddleware";

const changeBodyMiddleWare: RequestHandler = async (req, res, next) => {
  try {
    const { encryptedPassword } = req.body;
    if (encryptedPassword) {
      req.body.encryptedPassword = await encrypt(encryptedPassword, req.user._id);
    }
    req.body.user = req.user._id;
    next();
  } catch (error) {
    next(error);
  }
};

const diaryRouter = generateCrudRoutes({
  mongooseModel: PasswordManagerModel,
  name: "Diary",
  ioredis: redis,
  cachedTime: 600,
  middlewares: {
    create: [validatorMiddleware(diaryCreateValidate), changeBodyMiddleWare],
    update: [validatorMiddleware(diaryUpdateValidate), changeBodyMiddleWare],
    removeMany: [disabledMiddleware],
    updateMany: [disabledMiddleware],
  },
});

export default diaryRouter;
