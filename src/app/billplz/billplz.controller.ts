import { RequestHandler } from "express";
import globalController from "../../global/global.controller";
import sendResponse from "../../shared/sendResponse";
import BillplzModel from "./billplz.model";
import httpStatus from "http-status";
import PaymentModel from "../payments/payment.model";
import { ApiError } from "../../global/globalError";
import { IPayment } from "../payments/payment.interface";
import { bulkPaymentQueue } from "../../config/redis";
import { paymentStatusObj } from "../../shared/constant";
import redis from "../../config/redis";
import { v4 as uuid } from "uuid";

// variables
const name = "Billplz";
// global
const globalControllers = globalController(BillplzModel, name);

const bulkPayments: RequestHandler = async (req, res, next) => {
  try {
    const { ids, collection_id, collection_title } = req.body;

    const payments = await PaymentModel.find({
      _id: { $in: ids },
      // status: { $in: [paymentStatusObj.pending, paymentStatusObj.refunded] },
      status: { $ne: paymentStatusObj.completed },
    });

    if (!Array.isArray(payments)) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server error in bulk payment");

    // bull mq queue
    const jobOptions = payments.map((payment: IPayment, index) => ({
      name: `payment-${index + 1}`,
      data: {
        payment_order_collection_id: collection_id,
        bank_code: "DUMMYBANKVERIFIED", //! replace with actual bank code
        bank_account_number: payment.accountNumber,
        name: payment.accountName,
        description: collection_title || "Payment Order",
        email: payment.emailAddress,
        total: Number(payment.income),
        reference_id: payment.reference,
        paymentId: payment._id?.toString(),
      },
      opts: {
        jobId: uuid(),
        attempts: 3,
        delay: index * 10000,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    }));
    await bulkPaymentQueue.addBulk(jobOptions);
    console.log(`✅ Added ${payments.length} bulk payment jobs`);

    const cacheKey = `*api:v1:Payment*`.toLocaleLowerCase();
    const key = await redis.keys(cacheKey);
    if (key?.length > 0) redis.call("DEL", ...key);

    const payload = {
      success: true,
      message: `${name} created successfully`,
      data: {},
    };
    sendResponse(res, httpStatus.CREATED, payload);
    return;
  } catch (error) {
    next(error);
  }
};

const billplzController = { ...globalControllers, bulkPayments };
export default billplzController;
