import express from "express";
import userRouter from "./user/user.routes";
import { uploadCloudinary } from "../utils/uploadToCloudinary";
import paymentRouter from "./payments/payment.routes";
import paymentHistoryRouter from "./paymentHistory/paymentHistory.routes";
// import bukkuAxios from "../utils/axiosUtils";

const router = express.Router();

// const testRouter = async (req, res, next) => {
//   const data = await bukkuAxios.get("/sales/payments");
//   console.log(data);
//   res.send({ res: "test ", data: data.data });
// };

const moduleRoute = [
  { path: "/users", routes: userRouter },
  // { path: "/payments", routes: paymentRouter },
  // { path: "/payments-history", routes: paymentHistoryRouter },
  // { path: "/test", routes: testRouter },
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
