import globalController from "../../global/global.controller";
import paymentHistoryService from "./paymentHistory.service";

// variables
const name = "Payment History";
// global
const globalControllers = globalController(paymentHistoryService, name);

const paymentController = { ...globalControllers };
export default paymentController;
