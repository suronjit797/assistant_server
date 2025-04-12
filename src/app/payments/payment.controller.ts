import { RequestHandler } from "express";
import httpStatus from "http-status";
import { ApiError } from "../../global/globalError";
import sendResponse from "../../shared/sendResponse";
import paymentService from "./payment.service";
import PaymentModel from "./payment.model";
import globalController from "../../global/global.controller";

// variables
const name = "Payment";
// global
const globalControllers = globalController(PaymentModel, name);

const uploadCsvFile: RequestHandler = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No file uploaded");
    }

    const data = await paymentService.uploadCsvFile(file, req.user);
    const payload = {
      success: true,
      message: "upload success",
      data,
    };
    sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

const paymentController = { ...globalControllers, uploadCsvFile };
export default paymentController;
