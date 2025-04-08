import express from "express";
import { auth } from "../../middleware/auth";
import { userRole } from "../../shared/constant";
import paymentHistoryController from "./paymentHistory.controller";

const paymentRouter = express.Router();
const { admin } = userRole;


// paymentHistory
paymentRouter.get("/", auth(admin),  paymentHistoryController.getAll);
paymentRouter.get("/:id", auth(admin), paymentHistoryController.getSingle);
// paymentRouter.put("/:id", auth(admin), validatorMiddleware(paymentUpdateZodSchema), paymentHistoryController.update);
paymentRouter.delete("/:id", auth(admin), paymentHistoryController.remove);

export default paymentRouter;
