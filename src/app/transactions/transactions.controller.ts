import httpStatus from "http-status";
import { RequestHandler } from "express";
import globalController from "../../global/global.controller";
import TransactionsModel from "./transactions.model";
import dayjs from "dayjs";
import sendResponse from "../../shared/sendResponse";
import generateCacheKey from "../../helper/cacheKeyGenerator";
import redis from "../../config/redis";

// variables
const name = "Transactions";
// global
const globalControllers = globalController(TransactionsModel, name);

const summary: RequestHandler = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    // cached data
    const cacheKey = generateCacheKey(req);
    const cachedData = await redis.get(cacheKey);

    let data;

    if (cachedData) {
      const cachedDataJSON = JSON.parse(cachedData);
      data = cachedDataJSON;
    } else {
      const m = Number(month ?? dayjs().month() + 1);
      const y = Number(year ?? dayjs().year());

      const startOfMonth = dayjs(`${y}-${m}-01`).startOf("month").toDate();
      const endOfMonth = dayjs(startOfMonth).endOf("month").toDate();

      // MongoDB Aggregation: All-time
      const allTimePipeline = [
        {
          $group: {
            _id: "$type",
            totalAmount: { $sum: "$amount" },
          },
        },
      ];

      // MongoDB Aggregation: Monthly
      const monthlyPipeline = [
        {
          $match: {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: "$type",
            totalAmount: { $sum: "$amount" },
          },
        },
      ];

      const [allTime, monthly] = await Promise.all([
        TransactionsModel.aggregate(allTimePipeline),
        TransactionsModel.aggregate(monthlyPipeline),
      ]);

      // Format results
      const format = (arr: { _id: string; totalAmount: number }[]) =>
        arr.reduce(
          (acc, cur) => {
            acc[cur._id] = cur.totalAmount;
            return acc;
          },
          {} as Record<string, number>,
        );

      data = {
        allTime: format(allTime),
        month: `${m}`.padStart(2, "0"),
        year: y,
        monthly: format(monthly),
      };
    }

    const payload = {
      success: true,
      message: `Transactions summary fetched successfully`,
      data,
    };

    sendResponse(res, httpStatus.OK, payload);

    res.json();
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
