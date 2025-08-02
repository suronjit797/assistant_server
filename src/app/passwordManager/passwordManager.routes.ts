import { RequestHandler } from "express";
import { generateCrudRoutes } from "express-easy-curd";
import { validatorMiddleware } from "../../middleware/zodValidator";
import { encrypt } from "./../../helper/cryptoHelper";
import PasswordManagerModel from "./passwordManager.model";
import { pmCreateValidate, pmUpdateValidate } from "./passwordManager.validation";

const changeBodyMiddleWare: RequestHandler = async (req, res, next) => {
  try {
    const { encryptedPassword } = req.body;
    const encryption = await encrypt(encryptedPassword, req.user._id);
    req.body.encryptedPassword = encryption;
    req.body.user = req.user._id;
    next();
  } catch (error) {
    next(error);
  }
};
const disabledMiddleware: RequestHandler = async (req, res) => {
  res.status(404).send("route not found");
};

const transactionRouter = generateCrudRoutes({
  mongooseModel: PasswordManagerModel,
  name: "PasswordManager",
  middlewares: {
    create: [validatorMiddleware(pmCreateValidate), changeBodyMiddleWare],
    removeMany: [disabledMiddleware],
    updateMany: [disabledMiddleware],
    update: [validatorMiddleware(pmUpdateValidate)],
  },
});

export default transactionRouter;
