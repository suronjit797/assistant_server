import express from "express";
import { transactionCreateValidate, transactionUpdateValidate } from "./transactions.validation";
import { partialFilterMiddlewares, setUserToBody } from "../../middleware/globalMiddleware";
import { validatorMiddleware } from "../../middleware/zodValidator";
import transactionsController from "./transactions.controller";

const transactionRouter = express.Router();

transactionRouter.post(
  "/",
  validatorMiddleware(transactionCreateValidate),
  setUserToBody,
  transactionsController.create,
);

transactionRouter.get("/", partialFilterMiddlewares(["title", "type"]), transactionsController.getAll);
transactionRouter.get("/summary", transactionsController.summary);
transactionRouter.get("/overall", transactionsController.overall);

transactionRouter.get("/:id", transactionsController.getSingle);
transactionRouter.put("/:id", validatorMiddleware(transactionUpdateValidate), transactionsController.update);
transactionRouter.delete("/:id", transactionsController.remove);
transactionRouter.post("/delete-many", transactionsController.removeMany);

export default transactionRouter;
