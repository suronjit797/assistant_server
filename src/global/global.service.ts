import { Model } from "mongoose";
import type { IGetAll_service, IPagination, TFilter } from "./globalInterfaces";

const globalService = <TType>(
  ModelName: Model<TType, Record<string, unknown>>,
): {
  create: (body: TType) => Promise<TType>;
  getSingle: (id: string) => Promise<TType | null>;
  update: (id: string, payload: Partial<TType>) => Promise<TType | null>;
  remove: (id: string) => Promise<TType | null>;
  getAll: (pagination: IPagination, filter: Partial<TFilter>) => Promise<IGetAll_service<TType[]>>;
} => {
  return {
    // create
    create: async (body: TType): Promise<TType> => {
      return await ModelName.create(body);
    },

    // get all
    getAll: async (pagination: IPagination, filter: Partial<TFilter>): Promise<IGetAll_service<TType[]>> => {
      const { page, limit, skip, sortCondition } = pagination;
      const data = await ModelName.find(filter).limit(limit).skip(skip).sort(sortCondition);
      const total = await ModelName.countDocuments(filter);
      return { data, meta: { page, limit, total } };
    },

    // get single
    getSingle: async (id: string): Promise<TType | null> => {
      return await ModelName.findById(id);
    },

    // update single
    update: async (id: string, payload: Partial<TType>): Promise<TType | null> => {
      return await ModelName.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    },

    // remove single
    remove: async (id: string): Promise<TType | null> => {
      return await ModelName.findByIdAndDelete(id);
    },
  };
};

export default globalService;
