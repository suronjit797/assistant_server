import PaymentHistoryModel from "./paymentHistory.model";
import globalController from "../../global/global.controller";

// variables
const name = "Payment History";
// global
const controller = globalController(PaymentHistoryModel, name);

const paymentController = { ...controller };
export default paymentController;
