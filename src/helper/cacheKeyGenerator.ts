import { Request } from "express";

function generateCacheKey(req: Request) {
  const baseUrl = req.baseUrl.replace(/^\/+|\/+$/g, "").replace(/\//g, ":");

  // Extract and sort query parameters
  const query = req.query;
  const sortedQuery = Object.keys(query)
    .sort()
    .map((key) => `${key}=${query[key]}`)
    .join("&");

  // Extract and sort route parameters
  const params = req.params;
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  let cacheKey = baseUrl;
  if (sortedParams) cacheKey += `:${sortedParams}`;
  if (sortedQuery) cacheKey += `?${sortedQuery}`;

  return cacheKey;
}

export default generateCacheKey;
