import { RequestHandler } from "express";

export const setUserToBody: RequestHandler = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    next();
  } catch (error) {
    next(error);
  }
};

export const partialFilterMiddlewares =
  (partialFilter: string[]): RequestHandler =>
  (req, res, next) => {
    req.partialFilter = partialFilter;
    next();
  };

export const disabledMiddleware: RequestHandler = async (req, res) => {
  return res.status(404).send("route not found");
};
