import express from "express";
import { auth } from "../../middleware/auth";
import { userRole } from "../../shared/constant";
import paymentHistoryController from "./paymentHistory.controller";

const paymentHistoryRouter = express.Router();
const { admin } = userRole;


// paymentHistory
paymentHistoryRouter.get("/", auth(admin),  paymentHistoryController.getAll);
paymentHistoryRouter.get("/:id", auth(admin), paymentHistoryController.getSingle);
// paymentRouter.put("/:id", auth(admin), validatorMiddleware(paymentUpdateZodSchema), paymentHistoryController.update);
paymentHistoryRouter.delete("/:id", auth(admin), paymentHistoryController.remove);

export default paymentHistoryRouter;
