import { IPartialSearchableFields, TFilter } from "../global/globalInterfaces";
import pic from "./picHelper";
import { Document } from "mongoose";

// Supported operators for query
const operatorsMap: Record<string, string> = {
  _gt: "$gt", // greater than
  _lt: "$lt", // less than
  _gte: "$gte", // greater than or equal
  _lte: "$lte", // less than or equal
  _ne: "$ne", // not equal
  _in: "$in", // in array
  _nin: "$nin", // not in array
};

const filterHelper = <T extends Record<string, unknown>>(
  reqQuery: T,
  partialSearching: IPartialSearchableFields,
  schemaName: Document,
): Partial<TFilter> => {
  const schemaKeys = Object.keys(schemaName.schema.obj);
  const { search, ...rest } = pic(reqQuery, ["search", ...schemaKeys]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: Record<string, any>[] = [];

  // Handle search queries (partial match)
  if (search && partialSearching.length > 0) {
    conditions.push({
      $or: partialSearching.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    });
  }

  // Handle exact filters and operators (_gt, _lt, etc.)
  Object.entries(reqQuery).forEach(([key, value]) => {
    // Check if the key contains an operator
    const operatorKey = Object.keys(operatorsMap).find((op) => key.endsWith(op));
    if (operatorKey) {
      const operator = operatorsMap[operatorKey];
      const fieldName = key.replace(operatorKey, "");
      const operatorValue = Array.isArray(value) ? value : [value];
      conditions.push({ [fieldName]: { [operator]: operatorValue } });
    } else if (Object.keys(rest).includes(key)) {
      // Exact match condition

      if (typeof value === "string" && value.includes(",")) {
        conditions.push({ [key]: { $in: value.split(",") } });
      } else {
        conditions.push({ [key]: value });
      }
    }
  });

  return conditions.length > 0 ? { $and: conditions } : {};
};

export default filterHelper;
