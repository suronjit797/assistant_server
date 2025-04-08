import type { RequestHandler } from "express";
import httpStatus from "http-status";
import redis from "../config/redis";
import generateCacheKey from "../helper/cacheKeyGenerator";
import filterHelper from "../helper/filterHelper";
import { paginationHelper } from "../helper/paginitionHelper";
import sendResponse from "../shared/sendResponse";
import { ApiError } from "./globalError";
import { IMeta, IPagination, TFilter } from "./globalInterfaces";

interface ServiceMethods<T> {
  create: (data: T) => Promise<T | null>;
  getSingle: (id: string) => Promise<T | null>;
  getAll: (pagination: IPagination, filter: Partial<TFilter>) => Promise<{ data: T[]; meta: IMeta }>;
  update: (id: string, data: Partial<T>) => Promise<T | null>;
  remove: (id: string) => Promise<T | null>;
}

const globalController = <T>(
  service: ServiceMethods<T>,
  name: string,
): {
  create: RequestHandler;
  getAll: RequestHandler;
  getSingle: RequestHandler;
  update: RequestHandler;
  remove: RequestHandler;
} => {
  return {
    create: async (req, res, next) => {
      try {
        // invalid cache
        const cacheKey = `api:v1:${name}*`.toLocaleLowerCase();
        const key = await redis.keys(cacheKey);
        if (key?.length > 0) {
          redis.del(key);
        }

        const data = await service.create(req.body);

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

    getAll: async (req, res, next) => {
  
      try {
        let values: { data: Array<T>; meta: IMeta } = { data: [], meta: { limit: 10, page: 1, total: 0 } };
        // cached data
        const cacheKey = generateCacheKey(req);
        const cachedData = await redis.get(cacheKey);
        console.log({ cacheKey });

        if (cachedData) {
          const cachedDataJSON = JSON.parse(cachedData);
          values = cachedDataJSON;
        } else {
          // filter
          const pagination = paginationHelper(req.query);
          const filter = filterHelper(req.query, req.partialFilter);

          // get data from service
          values = await service.getAll(pagination, filter);

          if (values?.data?.length) {
            // can be used setex for auto expire
            redis.set(cacheKey, JSON.stringify(values));
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

    getSingle: async (req, res, next) => {
      try {
        let data: T | null = null;
        // cached data
        const cacheKey = generateCacheKey(req);
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
          data = JSON.parse(cachedData);
        } else {
          data = await service.getSingle(req.params.id);
          if (data) {
            redis.set(cacheKey, JSON.stringify(data));
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

    update: async (req, res, next) => {
      try {
        // invalid cache
        const cacheKey = `api:v1:${name}*`.toLocaleLowerCase();
        const key = await redis.keys(cacheKey);
        console.log(key, cacheKey);
        if (key?.length > 0) {
          redis.del(key);
        }

        const data = await service.update(req.params.id, req.body);

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

    remove: async (req, res, next) => {
      try {
        // invalid cache
        const cacheKey = `api:v1:${name}*`.toLocaleLowerCase();
        const key = await redis.keys(cacheKey);
        console.log(key, cacheKey);
        if (key?.length > 0) {
          redis.del(key);
        }

        const data = await service.remove(req.params.id);

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
  };
};

export default globalController;
