import express, { RequestHandler } from "express";
import userController from "./user.controller";
import { auth } from "../../middleware/auth";
import { userRole } from "../../shared/constant";
import { validatorMiddleware } from "../../middleware/zodValidator";
import {
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
  userCreateZodSchema,
  userLoginZodSchema,
  userUpdateZodSchema,
} from "./user.validation";

const userRouter = express.Router();
const { admin } = userRole;

const partialFilterMiddlewares: RequestHandler = (req, res, next) => {
  req.partialFilter = ["name", "email", "role"];
  next();
};

// auth
userRouter.post("/", validatorMiddleware(userCreateZodSchema), userController.create);
userRouter.post("/login", validatorMiddleware(userLoginZodSchema), userController.loginUser);
userRouter.post("/forgot-password", validatorMiddleware(forgotPasswordZodSchema), userController.forgotPassword);
userRouter.post("/reset-password", validatorMiddleware(resetPasswordZodSchema), userController.resetPassword);

// profile
userRouter.get("/profile", auth(), userController.getProfile);
userRouter.put("/profile", auth(), validatorMiddleware(userUpdateZodSchema), userController.updateProfile);
userRouter.delete("/profile", auth(), userController.removeProfile);

// user
userRouter.get("/", auth(), partialFilterMiddlewares, userController.getAll);
userRouter.get("/:id", auth(), userController.getSingle);
userRouter.put("/:id", auth(), validatorMiddleware(userUpdateZodSchema), userController.update);
userRouter.delete("/:id", auth(admin), userController.remove);

export default userRouter;
