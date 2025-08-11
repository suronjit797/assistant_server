import { generateCrudRoutes } from "express-easy-curd";
import redis from "../../config/redis";
import { disabledMiddleware } from "../../middleware/globalMiddleware";
import { validatorMiddleware } from "../../middleware/zodValidator";
import PasswordManagerModel from "./blog.model";
import { blogCreateValidate, blogUpdateValidate } from "./blog.validation";

const blogRouter = generateCrudRoutes({
  mongooseModel: PasswordManagerModel,
  name: "Blog",
  ioredis: redis,
  cachedTime: 600,
  middlewares: {
    create: [validatorMiddleware(blogCreateValidate)],
    update: [validatorMiddleware(blogUpdateValidate)],
    removeMany: [disabledMiddleware],
    updateMany: [disabledMiddleware],
  },
});

export default blogRouter;
