import { RequestHandler } from "express";
import httpStatus from "http-status";
import globalController from "../../global/global.controller";
import { ApiError } from "../../global/globalError";
import sendResponse from "../../shared/sendResponse";
import paymentService from "./payment.service";

// variables
const name = "Payment";
// global
const globalControllers = globalController(paymentService, name);

const uploadCsvFile: RequestHandler = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No file uploaded");
    }

    const data = await paymentService.uploadCsvFile(file);
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
