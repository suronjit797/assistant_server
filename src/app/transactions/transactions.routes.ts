import express from "express";
import { transactionCreateValidate, transactionUpdateValidate } from "./transactions.validation";
import { disabledMiddleware, partialFilterMiddlewares, setUserToBody } from "../../middleware/globalMiddleware";
import { validatorMiddleware } from "../../middleware/zodValidator";
import transactionsController from "./transactions.controller";
import { generateCrudRoutes } from "xmcrud";
import TransactionsModel from "./transactions.model";
import redisConnection from "../../config/redis";

const transactionRouter = express.Router();

transactionRouter.get("/summary", transactionsController.summary);

const partialFilters = ["title", "type"];
const globalRouter = generateCrudRoutes({
  mongooseModel: TransactionsModel,
  name: "transactions",
  ioredis: redisConnection,
  cachedTime: 600,
  middlewares: {
    getAll: [partialFilterMiddlewares(partialFilters)],
    create: [validatorMiddleware(transactionCreateValidate), setUserToBody],
    update: [validatorMiddleware(transactionUpdateValidate), setUserToBody],
    removeMany: [disabledMiddleware],
    updateMany: [disabledMiddleware],
  },
});

transactionRouter.use(globalRouter);

export default transactionRouter;
