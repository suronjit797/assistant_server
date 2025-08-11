import { generateCrudRoutes } from "express-easy-curd";
import redis from "../../config/redis";
import { disabledMiddleware, setUserToBody } from "../../middleware/globalMiddleware";
import { validatorMiddleware } from "../../middleware/zodValidator";
import DiaryModel from "./diary.model";
import { diaryCreateValidate, diaryUpdateValidate } from "./diary.validation";

const diaryRouter = generateCrudRoutes({
  mongooseModel: DiaryModel,
  name: "Diary",
  ioredis: redis,
  cachedTime: 600,
  middlewares: {
    create: [validatorMiddleware(diaryCreateValidate), setUserToBody],
    update: [validatorMiddleware(diaryUpdateValidate), setUserToBody],
    removeMany: [disabledMiddleware],
    updateMany: [disabledMiddleware],
  },
});

export default diaryRouter;
