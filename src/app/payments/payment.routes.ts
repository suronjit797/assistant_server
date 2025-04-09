import express, { RequestHandler } from "express";
import paymentController from "./payment.controller";
import { auth } from "../../middleware/auth";
import { userRole } from "../../shared/constant";
import { validatorMiddleware } from "../../middleware/zodValidator";
import { paymentUpdateZodSchema } from "./payment.validation";
import multer from "multer";

const paymentRouter = express.Router();
const { admin } = userRole;


//! need change into income
const partialFilterMiddlewares: RequestHandler = (req, res, next) => {
  req.partialFilter = [
    "product",
    "donorName",
    "trustDeedNo",
    "reference",
    "accountName",
    "bank",
    "name",
    "emailAddress",
  ];
  next();
};

// payment
paymentRouter.get("/", auth(admin), partialFilterMiddlewares, paymentController.getAll);
paymentRouter.get("/:id", auth(admin), paymentController.getSingle);
// paymentRouter.put("/:id", auth(admin), validatorMiddleware(paymentUpdateZodSchema), paymentController.update);
// paymentRouter.delete("/:id", auth(admin), paymentController.remove);

paymentRouter.post("/csv-upload", auth(admin), multer().single("file"), paymentController.uploadCsvFile);

export default paymentRouter;
