import express from "express";
import userRouter from "./user/user.routes";
import { uploadCloudinary } from "../utils/uploadToCloudinary";
import transactionRouter from "./transactions/transactions.routes";

const router = express.Router();

const moduleRoute = [
  { path: "/users", routes: userRouter },
  { path: "/transactions", routes: transactionRouter },
];

moduleRoute.forEach((route) => router.use(route.path, route.routes));

// image upload
router.post("/upload", uploadCloudinary.single("photo"), (req, res, next) => {
  try {
    const data = {
      uid: req.file?.filename,
      name: req.file?.filename.split("/").pop() + ".webp",
      url: req.file?.path,
      size: req.file?.size,
    };

    res.send({
      success: true,
      message: "File uploaded successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
