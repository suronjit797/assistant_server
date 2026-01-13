import { decrypt } from "./../../helper/cryptoHelper";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { RequestHandler } from "express";
import UserModel from "../user/user.model";
import { ApiError } from "../../global/globalError";
import PasswordManagerModel from "./passwordManager.model";
import { sendResponse } from "xmcrud";

const passwordDecrypt: RequestHandler = async (req, res, next) => {
  try {
    const { password, id } = req.body;
    const { _id } = req.user;

    const user = await UserModel.findById(_id).select("+password").lean();

    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    if (!user.isActive) throw new ApiError(httpStatus.BAD_REQUEST, "User is not active. Please contact admin");

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");

    const pm = await PasswordManagerModel.findById(id).lean();

    if (!pm?.encryptedPassword) throw new ApiError(500, "server error occurred");
    const decryptedPassword = await decrypt(pm?.encryptedPassword, _id);
    console.log(decryptedPassword);

    const payload = {
      success: true,
      message: "successfully decrypt",
      data: { ...pm, decryptedPassword: decryptedPassword },
    };

    return sendResponse(res, 200, payload);
  } catch (error) {
    next(error);
  }
};

export default { passwordDecrypt };
