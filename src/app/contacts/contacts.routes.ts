import { generateCrudRoutes } from "express-easy-curd";
import redis from "../../config/redis";
import { disabledMiddleware, setUserToBody } from "../../middleware/globalMiddleware";
import { validatorMiddleware } from "../../middleware/zodValidator";
import ContactModal from "./contacts.model";
import { contactCreateValidate, contactUpdateValidate } from "./contacts.validation";

const contactRouter = generateCrudRoutes({
  mongooseModel: ContactModal,
  name: "Contact",
  ioredis: redis,
  cachedTime: 600,
  middlewares: {
    create: [validatorMiddleware(contactCreateValidate), setUserToBody],
    update: [validatorMiddleware(contactUpdateValidate), setUserToBody],
    removeMany: [disabledMiddleware],
    updateMany: [disabledMiddleware],
  },
});

export default contactRouter;
