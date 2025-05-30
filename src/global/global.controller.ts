import { RequestHandler } from "express";
import httpStatus from "http-status";
import { Model, Types } from "mongoose";

import redis from "../config/redis";
import generateCacheKey from "../helper/cacheKeyGenerator";
import filterHelper from "../helper/filterHelper";
import { paginationHelper } from "../helper/paginationHelper";
import sendResponse from "../shared/sendResponse";
import { ApiError } from "./globalError";
import type { IMeta } from "./globalInterfaces";

const { ObjectId } = Types;

const globalController = <TType>(
  // ModelName: Model<TType>,
  ModelName: Model<TType>,
  name: string,
): {
  create: RequestHandler;
  getAll: RequestHandler;
  getSingle: RequestHandler;
  update: RequestHandler;
  remove: RequestHandler;
  removeMany: RequestHandler;
} => {
  return {
    // create
    create: async (req, res, next) => {
      try {
        // invalid cache
        const cacheKey = `api:v1:${name}*`.toLocaleLowerCase();
        const key = await redis.keys(cacheKey);
        if (key?.length > 0) {
          redis.del(key);
        }

        const data = await ModelName.create(req.body);

        const payload = {
          success: true,
          message: `${name} created successfully`,
          data,
        };
        sendResponse(res, httpStatus.CREATED, payload);
        return;
      } catch (error) {
        next(error);
      }
    },

    // get all
    getAll: async (req, res, next) => {
      try {
        let values: { data: Array<TType>; meta: IMeta } = { data: [], meta: { limit: 10, page: 1, total: 0 } };
        // cached data
        const cacheKey = generateCacheKey(req);
        const cachedData = await redis.get(cacheKey);
        // console.log({ cacheKey });

        if (cachedData) {
          const cachedDataJSON = JSON.parse(cachedData);
          values = cachedDataJSON;
        } else {
          // filter
          const pagination = paginationHelper(req.query);

          const filter = filterHelper(req.query, req.partialFilter, new ModelName());

          // get data from service
          const { page, limit, skip, sortCondition, populate } = pagination;
          const data = await ModelName.find(filter)
            .limit(limit)
            .skip(skip)
            .sort(sortCondition)
            .populate(populate || "");
          const total = await ModelName.countDocuments(filter);
          values = { data, meta: { page, limit, total } };

          if (values?.data?.length) {
            redis.set(cacheKey, JSON.stringify(values), "EX", 600);
          }
        }
        const { meta, data } = values;

        // payload
        const payload = {
          success: true,
          message: `${name}s fetched successfully`,
          meta,
          data,
        };
        sendResponse(res, httpStatus.OK, payload);
        return;
      } catch (error) {
        next(error);
      }
    },

    // get single
    getSingle: async (req, res, next) => {
      try {
        let data: TType | null = null;
        // cached data
        const cacheKey = generateCacheKey(req);
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
          data = JSON.parse(cachedData);
        } else {
          data = await await ModelName.findById(req.params.id);
          if (data) {
            redis.set(cacheKey, JSON.stringify(data), "EX", 600);
          }
        }

        // const data = await service.getSingle(req.params.id);
        const payload = {
          success: true,
          message: `${name} fetched successfully`,
          data,
        };
        sendResponse(res, httpStatus.OK, payload);
        return;
      } catch (error) {
        next(error);
      }
    },

    // update single
    update: async (req, res, next) => {
      try {
        // invalid cache
        const cacheKey = `api:v1:${name}*`.toLocaleLowerCase();
        const key = await redis.keys(cacheKey);
        if (key?.length > 0) {
          redis.del(key);
        }

        const data = await ModelName.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!data) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
        }

        const payload = {
          success: true,
          message: `${name} updated successfully`,
          data,
        };
        sendResponse(res, httpStatus.OK, payload);
        return;
      } catch (error) {
        next(error);
      }
    },

    // remove single
    remove: async (req, res, next) => {
      try {
        // invalid cache
        const cacheKey = `api:v1:${name}*`.toLocaleLowerCase();
        const key = await redis.keys(cacheKey);
        // console.log(key, cacheKey);
        if (key?.length > 0) {
          redis.del(key);
        }

        const data = await ModelName.findByIdAndDelete(req.params.id);

        const payload = {
          success: true,
          message: `${name} deleted successfully`,
          data,
        };
        sendResponse(res, httpStatus.OK, payload);
        return;
      } catch (error) {
        next(error);
      }
    },

    // remove all
    removeMany: async (req, res, next) => {
      try {
        // invalid cache
        const cacheKey = `api:v1:${name}*`.toLocaleLowerCase();
        const key = await redis.keys(cacheKey);

        if (key?.length > 0) redis.del(key);

        const ids = req.body.ids;
        if (!ids || !ids.length) throw new ApiError(httpStatus.BAD_REQUEST, "No ids provided");
        const filter = { _id: { $in: ids.map((id: string) => new ObjectId(id)) } };
        const data = await ModelName.deleteMany(filter);

        const payload = {
          success: true,
          message: `${name}s deleted successfully`,
          data,
        };
        sendResponse(res, httpStatus.OK, payload);
        return;
      } catch (error) {
        next(error);
      }
    },
  };
};

export default globalController;
