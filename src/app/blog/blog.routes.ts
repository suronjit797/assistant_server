import { generateCrudRoutes, partialFilterMiddlewares } from "express-easy-curd";
import redis from "../../config/redis";
import { disabledMiddleware, setUserToBody } from "../../middleware/globalMiddleware";
import { validatorMiddleware } from "../../middleware/zodValidator";
import BlogModel from "./blog.model";
import { blogCreateValidate, blogUpdateValidate } from "./blog.validation";

const partialFilters = ["title", "slug", "content"];

const blogRouter = generateCrudRoutes({
  mongooseModel: BlogModel,
  name: "Blog",
  ioredis: redis,
  cachedTime: 600,
  middlewares: {
    getAll: [partialFilterMiddlewares(partialFilters)],
    create: [validatorMiddleware(blogCreateValidate), setUserToBody],
    update: [validatorMiddleware(blogUpdateValidate), setUserToBody],
    removeMany: [disabledMiddleware],
    updateMany: [disabledMiddleware],
  },
});

export default blogRouter;
