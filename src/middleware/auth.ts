import { RequestHandler } from "express";
import httpStatus from "http-status";
import config from "../config";
import { CustomJwtPayload } from "../global/globalInterfaces";
import jwt from "jsonwebtoken";
import { userRole } from "../shared/constant";
import { ApiError } from "../global/globalError";
import UserModel from "../app/user/user.model";

export const extractToken = (authorizationHeader: string | undefined): string | null => {
  if (!authorizationHeader) return null;
  const [bearer, token] = authorizationHeader.split(" ");
  return bearer === config.Bearer && token ? token : null;
};

export const auth =
  (...roles: string[]): RequestHandler =>
  async (req, res, next) => {
    try {
      let token = extractToken(req.headers.authorization);
      const refreshToken = req.cookies.refreshToken;

      if (!token) {
        if (!refreshToken) {
          throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");
        }

        // Verify refresh token
        try {
          const decodedRefresh = jwt.verify(refreshToken, config.token.refresh_token_secret) as CustomJwtPayload;
          const user = await UserModel.findById(decodedRefresh.userId);

          if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
          }

          // Generate a new access token
          token = jwt.sign({ userId: user._id }, config.token.access_token_secret, {
            expiresIn: config.token.access_token_time,
          });

          // Attach new token to response headers
          res.setHeader("Authorization", `${config.Bearer} ${token}`);
        } catch {
          throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
        }
      }

      // Verify access token
      const decoded = jwt.verify(token, config.token.access_token_secret) as CustomJwtPayload;
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      }

      // Check user role
      const allowedRoles = [...roles, userRole.superAdmin];
      if (roles.length > 0 && !allowedRoles.includes(user.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized Access");
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
