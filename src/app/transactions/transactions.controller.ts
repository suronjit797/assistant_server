import { RequestHandler } from "express";
import globalController from "../../global/global.controller";
import TransactionsModel from "./transactions.model";

// variables
const name = "Transactions";
// global
const globalControllers = globalController(TransactionsModel, name);

const summary: RequestHandler = async (req, res, next) => {
  try {
    console.log("summary");
  } catch (error) {
    next(error);
  }
};

const overall: RequestHandler = async (req, res, next) => {
  try {
    console.log("overall");
  } catch (error) {
    next(error);
  }
};

export default { ...globalControllers, summary, overall };
