import { SortOrder } from "mongoose";
import { IPagination, ISortCondition } from "../global/globalInterfaces";
import pic from "./picHelper";

export const paginationHelper = (obj: Record<string, unknown>): IPagination => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    populate = "",
  } = pic(obj, ["page", "limit", "sortBy", "sortOrder", "populate"]) as {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
    populate?: string;
  };

  const parsedPage = Math.abs(Number(page)) || 1;
  const parsedLimit = Math.abs(Number(limit)) || 10;
  const skip = (parsedPage - 1) * parsedLimit;

  const validSortOrders: SortOrder[] = [1, -1, "asc", "ascending", "desc", "descending"];
  const parsedSortOrder: SortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "desc";

  const sortCondition: ISortCondition = { [sortBy]: parsedSortOrder };

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
    sortCondition,
    populate,
  };
};
