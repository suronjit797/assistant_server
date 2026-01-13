import { RequestHandler, Router } from "express";
import { generateCrudRoutes, partialFilterMiddlewares } from "xmcrud";
import { validatorMiddleware } from "../../middleware/zodValidator";
import { encrypt } from "./../../helper/cryptoHelper";
import PasswordManagerModel from "./passwordManager.model";
import { pmCreateValidate, pmUpdateValidate } from "./passwordManager.validation";
import redis from "../../config/redis";
import passwordManagerController from "./passwordManager.controller";
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

const partialFilters = ["website", "username", "note", "category"];

const pmRouter = Router();

const curdRouter = generateCrudRoutes({
  mongooseModel: PasswordManagerModel,
  name: "PasswordManager",
  ioredis: redis,
  cachedTime: 600,
  middlewares: {
    getAll: [partialFilterMiddlewares(partialFilters)],
    create: [validatorMiddleware(pmCreateValidate), changeBodyMiddleWare],
    update: [validatorMiddleware(pmUpdateValidate), changeBodyMiddleWare],
    removeMany: [disabledMiddleware],
    updateMany: [disabledMiddleware],
  },
});

pmRouter.post("/decrypt", passwordManagerController.passwordDecrypt);

pmRouter.use(curdRouter);

export default pmRouter;
