import express from "express";
import { transactionCreateValidate, transactionUpdateValidate } from "./transactions.validation";
// import { auth } from "../../../middleware/auth";
import transactionsController from "./transactions.controller";
import { validatorMiddleware } from "../../middleware/zodValidator";
import { setUserToBody } from "./transactions.middleware";

const transactionRouter = express.Router();

transactionRouter.post(
  "/",
  validatorMiddleware(transactionCreateValidate),
  setUserToBody,
  transactionsController.create,
);

transactionRouter.get("/", transactionsController.getAll);
transactionRouter.get("/summary", transactionsController.summary);
transactionRouter.get("/overall", transactionsController.overall);

transactionRouter.get("/:id", transactionsController.getSingle);
transactionRouter.put("/:id", validatorMiddleware(transactionUpdateValidate), transactionsController.update);
transactionRouter.delete("/:id", transactionsController.remove);

export default transactionRouter;
