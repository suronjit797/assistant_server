import { RequestHandler } from "express";

export const setUserToBody: RequestHandler = async (req, res, next) => {
  console.log(req.user);
  try {
    req.body.user = req.user._id;
    next();
  } catch (error) {
    next(error);
  }
};
