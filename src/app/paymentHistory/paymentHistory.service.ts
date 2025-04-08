import globalService from "../../global/global.service";
import PaymentHistoryModel from "./paymentHistory.model";

const globalServices = globalService(PaymentHistoryModel);

const paymentService = { ...globalServices };

export default paymentService;
