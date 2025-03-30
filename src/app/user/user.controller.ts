import { RequestHandler } from "express";
import httpStatus from "http-status";
import globalController from "../../global/global.controller";
import { ApiError } from "../../global/globalError";
import sendResponse from "../../shared/sendResponse";
import userService from "./user.service";
import UserModel from "./user.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import sendEmail from "../../utils/sendMail";
import { mailTemplate } from "../../utils/makeEmailTemplate";

// variables
const name = "User";
// global
const globalControllers = globalController(userService, name);

// login and register
export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.login(req.body);

    if (!data) {
      // Unauthorized error for failed login attempts
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const { accessToken, refreshToken } = data;

    const cookieOptions = {
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(httpStatus.OK).send({
      success: true,
      message: "User logged in successfully",
      token: accessToken,
    });
    return;
  } catch (error) {
    next(error);
  }
};

const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.getSingle(req.user._id);
    const payload = {
      success: true,
      message: "Profile fetched successfully",
      data,
    };
    sendResponse(res, httpStatus.OK, payload);
    return;
  } catch (error) {
    next(error);
  }
};

const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.update(req.user._id, req.body);
    const payload = {
      success: true,
      message: "Profile updated successfully",
      data,
    };
    sendResponse(res, httpStatus.OK, payload);
    return;
  } catch (error) {
    next(error);
  }
};

const removeProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.remove(req.user._id);
    const payload = {
      success: true,
      message: "Profile deleted successfully",
      data,
    };
    sendResponse(res, httpStatus.OK, payload);
    return;
  } catch (error) {
    next(error);
  }
};

// Request body validation schema

export const forgotPassword: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    // Validate request body
    await userService.forgotPassword(req.body.email);

    const payload = {
      success: true,
      message: "Password reset link sent to your mail",
    };

    sendResponse(res, httpStatus.OK, payload);
    return;
  } catch (error) {
    next(error);
  }
};

export const resetPassword: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    // Validate request body
    const data = await userService.resetPassword(req.body);

    const payload = {
      success: true,
      message: "Password reset successfully",
      data,
    };

    sendResponse(res, httpStatus.OK, payload);
    return;
  } catch (error) {
    next(error);
  }
};

const userController = { ...globalControllers, getProfile, updateProfile, loginUser, removeProfile, forgotPassword, resetPassword };
export default userController;
