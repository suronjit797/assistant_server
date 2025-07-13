import { RequestHandler } from "express";

export const setUserToBody: RequestHandler = async (req, res, next) => {
  console.log(req.user);
  try {
    req.body.user = req.user._id;
    console.log("body", req.body);
    next();
  } catch (error) {
    next(error);
  }
};
